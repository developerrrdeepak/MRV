export type SoilInput =
  | {
      kind: "soil";
      soc_percent: number; // SOC in percent by weight (% C)
      bulk_density_g_cm3: number; // g/cm3 (equivalently t/m3)
      depth_cm: number; // soil depth considered (cm)
      rock_fragment_pct?: number; // % volume fraction [0-100]
    }
  | {
      kind: "soil_gkg";
      soc_g_per_kg: number; // SOC in g/kg
      bulk_density_g_cm3: number; // g/cm3 (equivalently t/m3)
      depth_cm: number; // soil depth considered (cm)
      rock_fragment_pct?: number; // % volume fraction [0-100]
    };

export type TreeAGBInput =
  | {
      kind: "agb";
      agb_t_ha: number; // Above-ground biomass in t/ha (Mg/ha)
    }
  | {
      kind: "allometric";
      dbh_cm: number; // diameter at breast height
      wood_density_g_cm3: number; // basic wood density
      height_m?: number; // optional tree height
    };

export interface CarbonOutputs {
  carbon_t_ha: number; // tonnes C per hectare
  co2e_t_ha: number; // tonnes CO2-e per hectare
  details?: Record<string, number>;
}

export function round(value: number, digits = 3): number {
  const p = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * p) / p;
}

// Soil organic carbon stock calculator.
// Returns SOC stock in tC/ha and tCO2e/ha using standard IPCC approach.
export function computeSoilCarbon(input: SoilInput): CarbonOutputs {
  const rf = input.rock_fragment_pct
    ? Math.max(0, Math.min(100, input.rock_fragment_pct)) / 100
    : 0;
  const bd_t_m3 = input.bulk_density_g_cm3; // 1 g/cm3 == 1 t/m3
  const depth_m = input.depth_cm / 100;

  let soc_t_ha: number;
  if (input.kind === "soil") {
    // Using SOC% by weight. Common simplification yields factor 0.1 when BD in g/cm3 and depth in cm.
    const soc_frac = input.soc_percent / 100; // fraction
    soc_t_ha = soc_frac * bd_t_m3 * input.depth_cm * (1 - rf) * 10; // = soc%/100 * BD * depth(cm) * 10
  } else {
    // SOC in g/kg. Formula: SOC_stock (t/ha) = SOC(g/kg) * BD(t/m3) * depth(m) * 10 * (1 - RF)
    soc_t_ha = input.soc_g_per_kg * bd_t_m3 * depth_m * 10 * (1 - rf);
  }

  const carbon_t_ha = soc_t_ha;
  const co2e_t_ha = carbon_t_ha * (44 / 12);

  return {
    carbon_t_ha: round(carbon_t_ha, 3),
    co2e_t_ha: round(co2e_t_ha, 3),
    details: {
      rock_fragment_fraction: round(rf, 4),
      bulk_density_t_m3: round(bd_t_m3, 4),
      depth_m: round(depth_m, 4),
    },
  };
}

// Above-ground biomass carbon from either direct AGB or allometry (Chave 2014 simplified)
export function computeAGBCarbon(input: TreeAGBInput): CarbonOutputs {
  let agb_t_ha: number;
  if (input.kind === "agb") {
    agb_t_ha = input.agb_t_ha;
  } else {
    const D = input.dbh_cm;
    const WD = input.wood_density_g_cm3;
    const H = input.height_m;

    // Chave et al. (2014) generalized moist tropical allometry.
    // If height is available: AGB = 0.0673 * (WD * D^2 * H)^0.976
    // Otherwise use a height-free form: AGB = 0.0673 * (WD * D^2)^0.976
    const x = WD * D * D * (H ? H : 1);
    agb_t_ha = 0.0673 * Math.pow(Math.max(x, 0), 0.976);
  }

  const carbon_t_ha = agb_t_ha * 0.47; // IPCC default carbon fraction
  const co2e_t_ha = carbon_t_ha * (44 / 12);

  return {
    carbon_t_ha: round(carbon_t_ha, 3),
    co2e_t_ha: round(co2e_t_ha, 3),
    details: {
      agb_t_ha: round(agb_t_ha, 3),
      carbon_fraction: 0.47,
    },
  };
}
