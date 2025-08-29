import { EstimatorRequest, EstimatorResult } from "@shared/api";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function estimateCarbon(
  payload: EstimatorRequest,
): Promise<EstimatorResult> {
  // Try ML model first
  try {
    const repo = (await import("../ml/repository")).MLRepository.getInstance();
    const latest = await repo.getLatestModel();
    if (latest) {
      const { gatherExternalData } = await import("../ml/dataSources");
      const { buildFeatures } = await import("../ml/features");
      const { predict } = await import("../ml/linear");

      const ext = await gatherExternalData(payload.latitude, payload.longitude);
      const feats = buildFeatures(payload, ext);
      const pred = predict(latest.model, feats);

      const yearsML = Math.max(
        1,
        Math.floor(Number(payload.durationYears ?? 1)),
      );
      const totalML = pred * yearsML;
      const priceINR = 500;
      return {
        creditsPerYear: Number(pred.toFixed(2)),
        totalCredits: Number(totalML.toFixed(2)),
        estimatedIncomeINR: Math.round(totalML * priceINR),
        assumptions: {
          modelVersion: latest.version,
          years: yearsML,
          priceINR,
          areaHectares: Math.max(0, Number(payload.areaHectares || 0)),
        },
      };
    }
  } catch (e) {
    // fall back to rules
  }

  const area = Math.max(0, Number(payload.areaHectares || 0));
  const type = payload.projectType;
  const ndvi = clamp(Number(payload.ndvi ?? 0.7), 0, 1);
  const biomass = Math.max(0, Number(payload.biomass ?? 12)); // t/ha
  const irrigation = payload.irrigation || "rainfed";
  const soilPh = Number(payload.soilPh ?? 6.8);
  const years = Math.max(1, Math.floor(Number(payload.durationYears ?? 1)));

  const baseline: Record<typeof type, number> = {
    agroforestry: 3.2,
    rice: 1.6,
    soil: 1.8,
    biomass: 2.0,
  } as const;

  let creditsPerHa = baseline[type];

  const ndviFactor = 0.7 + ndvi * 0.5;
  const biomassFactor = clamp(0.7 + (biomass / 12) * 0.3, 0.6, 1.3);

  const irrigationFactorMap: Record<string, number> = {
    drip: 1.1,
    sprinkler: 1.05,
    flood: 0.9,
    rainfed: 1.0,
  };
  const irrigationFactor = irrigationFactorMap[irrigation] ?? 1.0;

  const phPenalty = soilPh < 6.2 || soilPh > 7.2 ? 0.9 : 1.0;

  if (payload.baselineCarbon && payload.baselineCarbon > 0) {
    creditsPerHa = payload.baselineCarbon;
  }

  const creditsPerYear =
    area *
    creditsPerHa *
    ndviFactor *
    biomassFactor *
    irrigationFactor *
    phPenalty;
  const totalCredits = creditsPerYear * years;
  const priceINR = 500;
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
