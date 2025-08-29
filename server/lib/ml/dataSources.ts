type ClimateSummary = { avgTempC: number; totalPrecipMm: number };
export type ExternalData = {
  climate?: ClimateSummary;
  solarRadiation?: number; // kWh/m^2/day
  soilOrganicCarbon?: number; // g/kg or similar scale
};

async function safeFetch(url: string, timeoutMs = 8000): Promise<any> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function fetchOpenMeteo(lat: number, lon: number): Promise<ClimateSummary | undefined> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=30&forecast_days=0`;
    const json = await safeFetch(url);
    const d = json?.daily;
    if (!d?.time?.length) return undefined;
    const n = d.time.length;
    let sumT = 0;
    let sumP = 0;
    for (let i = 0; i < n; i++) {
      const tmax = Number(d.temperature_2m_max?.[i] ?? 0);
      const tmin = Number(d.temperature_2m_min?.[i] ?? 0);
      sumT += (tmax + tmin) / 2;
      sumP += Number(d.precipitation_sum?.[i] ?? 0);
    }
    return { avgTempC: sumT / n, totalPrecipMm: sumP };
  } catch {
    return undefined;
  }
}

function formatDateYYYYMMDD(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export async function fetchNasaPowerSolar(lat: number, lon: number): Promise<number | undefined> {
  try {
    const end = new Date();
    const start = new Date(Date.now() - 30 * 86400000);
    const startStr = formatDateYYYYMMDD(start);
    const endStr = formatDateYYYYMMDD(end);
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=AG&latitude=${lat}&longitude=${lon}&start=${startStr}&end=${endStr}&format=JSON`;
    const json = await safeFetch(url);
    const vals = json?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
    if (!vals) return undefined;
    const arr = Object.values(vals).map((v: any) => Number(v)).filter((v: any) => !isNaN(v));
    if (!arr.length) return undefined;
    const avg = arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
    return avg;
  } catch {
    return undefined;
  }
}

export async function fetchSoilOrganicCarbon(lat: number, lon: number): Promise<number | undefined> {
  try {
    // SoilGrids approximate endpoint; may change. Best-effort fetch.
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=ocd&depth=0-5cm`;
    const json = await safeFetch(url);
    const layers = json?.properties?.layers;
    if (!Array.isArray(layers) || !layers.length) return undefined;
    const stats = layers[0]?.depths?.[0]?.values;
    const mean = stats?.mean;
    const val = Number(mean);
    if (!isFinite(val)) return undefined;
    return val;
  } catch {
    return undefined;
  }
}

export async function gatherExternalData(lat?: number, lon?: number): Promise<ExternalData> {
  if (typeof lat !== "number" || typeof lon !== "number") return {};
  const [climate, solar, soc] = await Promise.all([
    fetchOpenMeteo(lat, lon),
    fetchNasaPowerSolar(lat, lon),
    fetchSoilOrganicCarbon(lat, lon),
  ]);
  return {
    climate: climate,
    solarRadiation: solar,
    soilOrganicCarbon: soc,
  };
}
