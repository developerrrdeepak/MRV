import type { RequestHandler } from "express";

async function safeFetch(url: string, timeoutMs = 8000) {
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

// GET /api/iot/soil?lat=..&lon=..
export const getSoilData: RequestHandler = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (!isFinite(lat) || !isFinite(lon)) {
      return res.status(400).json({ success: false, message: "lat/lon required" });
    }
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "OPENWEATHER_API_KEY not configured" });
    }
    const url = `https://api.openweathermap.org/data/2.5/soil?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const json = await safeFetch(url);

    // Normalize different possible field names
    const temp = Number(
      json?.t_soil ?? json?.temp ?? json?.main?.temp ?? json?.temperature ?? json?.soil_temperature,
    );
    const moistureRaw = Number(
      json?.m_soil ?? json?.moisture ?? json?.soil_moisture ?? json?.sm ?? json?.water_content,
    );
    // Heuristic to convert to percent if value seems fractional (0-1) or mm
    let moisturePercent: number | undefined;
    if (isFinite(moistureRaw)) {
      if (moistureRaw <= 1) moisturePercent = Math.round(moistureRaw * 100);
      else if (moistureRaw <= 10) moisturePercent = Math.round(moistureRaw * 10);
      else if (moistureRaw <= 100) moisturePercent = Math.round(moistureRaw);
      else moisturePercent = Math.round((moistureRaw / 100) * 100);
    }

    const humidity = Number(json?.humidity ?? json?.main?.humidity);

    res.json({ success: true, data: { temperatureC: isFinite(temp) ? temp : null, moisturePercent: isFinite(moisturePercent as any) ? moisturePercent : null, humidity: isFinite(humidity) ? humidity : null } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "soil fetch failed", error: error?.message });
  }
};
