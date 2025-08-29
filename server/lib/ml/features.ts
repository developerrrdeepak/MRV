import { EstimatorRequest } from "@shared/api";
import { ExternalData } from "./dataSources";

export type FeatureVector = number[];

function oneHot(value: string | undefined, categories: string[]): number[] {
  return categories.map((c) => (value === c ? 1 : 0));
}

export function buildFeatures(
  input: Partial<EstimatorRequest>,
  ext?: ExternalData,
): FeatureVector {
  const area = Math.max(0, Number(input.areaHectares ?? 0));
  const ndvi = clamp(Number(input.ndvi ?? 0.7), 0, 1);
  const biomass = Math.max(0, Number(input.biomass ?? 12));
  const soilPh = Number(input.soilPh ?? 6.8);
  const years = Math.max(1, Math.floor(Number(input.durationYears ?? 1)));

  const projectCats = ["agroforestry", "rice", "soil", "biomass"] as const;
  const irrigationCats = ["drip", "sprinkler", "flood", "rainfed"] as const;

  const proj = oneHot(input.projectType, projectCats as unknown as string[]);
  const irr = oneHot(input.irrigation, irrigationCats as unknown as string[]);

  const avgTempC = Number(ext?.climate?.avgTempC ?? 24);
  const totalPrecipMm = Number(ext?.climate?.totalPrecipMm ?? 100);
  const solar = Number(ext?.solarRadiation ?? 5);
  const soc = Number(ext?.soilOrganicCarbon ?? 15);

  return [
    area,
    ndvi,
    biomass,
    soilPh,
    years,
    ...proj,
    ...irr,
    avgTempC,
    totalPrecipMm,
    solar,
    soc,
  ];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
