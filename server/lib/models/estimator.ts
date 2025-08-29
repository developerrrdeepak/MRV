import { EstimatorRequest, EstimatorResult } from "@shared/api";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function estimateCarbon(payload: EstimatorRequest): EstimatorResult {
  const area = Math.max(0, Number(payload.areaHectares || 0));
  const type = payload.projectType;
  const ndvi = clamp(Number(payload.ndvi ?? 0.7), 0, 1);
  const biomass = Math.max(0, Number(payload.biomass ?? 12)); // t/ha
  const irrigation = payload.irrigation || "rainfed";
  const soilPh = Number(payload.soilPh ?? 6.8);
  const years = Math.max(1, Math.floor(Number(payload.durationYears ?? 1)));

  // Baseline credits per hectare per year (tCO2e/ha/yr)
  const baseline: Record<typeof type, number> = {
    agroforestry: 3.2,
    rice: 1.6,
    soil: 1.8,
    biomass: 2.0,
  } as const;

  let creditsPerHa = baseline[type];

  // NDVI factor: 0.6 → 0.85x, 0.8 → 1.05x, 0.9+ → up to 1.15x
  const ndviFactor = 0.7 + ndvi * 0.5; // 0.7..1.2 typical

  // Biomass factor: 8 → 0.9x, 12 → 1x, 18 → 1.15x
  const biomassFactor = clamp(0.7 + (biomass / 12) * 0.3, 0.6, 1.3);

  // Irrigation factor
  const irrigationFactorMap: Record<string, number> = {
    drip: 1.1,
    sprinkler: 1.05,
    flood: 0.9,
    rainfed: 1.0,
  };
  const irrigationFactor = irrigationFactorMap[irrigation] ?? 1.0;

  // Soil pH penalty outside 6.2-7.2
  const phPenalty = soilPh < 6.2 || soilPh > 7.2 ? 0.9 : 1.0;

  // Optional external baseline override
  if (payload.baselineCarbon && payload.baselineCarbon > 0) {
    creditsPerHa = payload.baselineCarbon;
  }

  const creditsPerYear = area * creditsPerHa * ndviFactor * biomassFactor * irrigationFactor * phPenalty;
  const totalCredits = creditsPerYear * years;
  const priceINR = 500; // assumed price per credit
  const estimatedIncomeINR = totalCredits * priceINR;

  return {
    creditsPerYear: Number(creditsPerYear.toFixed(2)),
    totalCredits: Number(totalCredits.toFixed(2)),
    estimatedIncomeINR: Math.round(estimatedIncomeINR),
    assumptions: {
      baselineCreditsPerHa: Number(creditsPerHa.toFixed(2)),
      ndviFactor: Number(ndviFactor.toFixed(2)),
      biomassFactor: Number(biomassFactor.toFixed(2)),
      irrigationFactor: Number(irrigationFactor.toFixed(2)),
      phPenalty,
      years,
      priceINR,
      areaHectares: area,
      ndvi,
      biomass,
      soilPh,
      projectType: type,
    },
  };
}
