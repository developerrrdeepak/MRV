import "dotenv/config";
import Database from "../server/lib/database";
import { MLRepository } from "../server/lib/ml/repository";
import { gatherExternalData } from "../server/lib/ml/dataSources";
import { buildFeatures } from "../server/lib/ml/features";
import type { EstimatorRequest } from "../shared/api";

function mapProjectType(
  s?: string,
): EstimatorRequest["projectType"] | undefined {
  switch ((s || "").toLowerCase()) {
    case "rice":
      return "rice";
    case "agroforestry":
    case "mixed_cropping":
      return "agroforestry";
    case "tree_plantation":
    case "forest":
      return "biomass";
    case "organic_field":
    case "conventional_field":
    case "fallow":
      return "soil";
    default:
      return undefined;
  }
}

function mapIrrigation(s?: string): EstimatorRequest["irrigation"] | undefined {
  switch ((s || "").toLowerCase()) {
    case "flood":
    case "flooded":
    case "deep_flooded":
      return "flood";
    case "sprinkler":
    case "alternate_wetting_drying":
      return "sprinkler";
    case "drip":
      return "drip";
    case "rainfed":
      return "rainfed";
    default:
      return undefined;
  }
}

async function main() {
  const db = Database.getInstance();
  await db.connect();
  const repo = MLRepository.getInstance();

  const raw = [
    {
      label: 2.5,
      estimatorInput: {
        areaHectares: 1.2,
        projectType: "rice",
        ndvi: 0.72,
        irrigation: "flooded",
        durationYears: 1,
      },
      latitude: 28.61,
      longitude: 77.2,
    },
    {
      label: 4.2,
      estimatorInput: {
        areaHectares: 3.5,
        projectType: "agroforestry",
        biomass: 22.4,
        soilPh: 6.5,
        durationYears: 5,
      },
      latitude: 23.25,
      longitude: 77.41,
    },
    {
      label: 0.8,
      estimatorInput: {
        areaHectares: 2.0,
        projectType: "fallow",
        ndvi: 0.21,
        soilPh: 5.9,
        durationYears: 1,
      },
      latitude: 25.31,
      longitude: 82.97,
    },
    {
      label: 1.2,
      estimatorInput: {
        areaHectares: 1.8,
        projectType: "rice",
        irrigation: "deep_flooded",
        ndvi: 0.4,
        durationYears: 1,
      },
      latitude: 26.91,
      longitude: 75.78,
    },
    {
      label: 3.0,
      estimatorInput: {
        areaHectares: 1.6,
        projectType: "rice",
        irrigation: "alternate_wetting_drying",
        ndvi: 0.68,
        durationYears: 1,
      },
      latitude: 22.57,
      longitude: 88.36,
    },
    {
      label: 2.8,
      estimatorInput: {
        areaHectares: 2.4,
        projectType: "mixed_cropping",
        ndvi: 0.6,
        biomass: 15.0,
        durationYears: 2,
      },
      latitude: 19.07,
      longitude: 72.87,
    },
    {
      label: 5.5,
      estimatorInput: {
        areaHectares: 5.0,
        projectType: "tree_plantation",
        biomass: 40.2,
        soilPh: 6.8,
        durationYears: 10,
      },
      latitude: 12.97,
      longitude: 77.59,
    },
    {
      label: 3.5,
      estimatorInput: {
        areaHectares: 1.0,
        projectType: "organic_field",
        ndvi: 0.75,
        soilPh: 7.2,
        durationYears: 3,
      },
      latitude: 15.29,
      longitude: 74.12,
    },
    {
      label: 1.7,
      estimatorInput: {
        areaHectares: 1.3,
        projectType: "conventional_field",
        ndvi: 0.45,
        soilPh: 5.7,
        durationYears: 2,
      },
      latitude: 21.14,
      longitude: 79.08,
    },
    {
      label: 6.2,
      estimatorInput: {
        areaHectares: 8.0,
        projectType: "forest",
        ndvi: 0.88,
        biomass: 80.0,
        soilPh: 6.4,
        durationYears: 15,
      },
      latitude: 11.01,
      longitude: 76.95,
    },
  ];

  let ok = 0;
  for (const item of raw) {
    const inp: Partial<EstimatorRequest> = {
      areaHectares: Number(item.estimatorInput?.areaHectares ?? 0),
      projectType: mapProjectType(item.estimatorInput?.projectType),
      ndvi:
        typeof item.estimatorInput?.ndvi === "number"
          ? item.estimatorInput?.ndvi
          : undefined,
      biomass:
        typeof item.estimatorInput?.biomass === "number"
          ? item.estimatorInput?.biomass
          : undefined,
      irrigation: mapIrrigation((item.estimatorInput as any)?.irrigation),
      soilPh:
        typeof item.estimatorInput?.soilPh === "number"
          ? item.estimatorInput?.soilPh
          : undefined,
      durationYears:
        typeof item.estimatorInput?.durationYears === "number"
          ? item.estimatorInput?.durationYears
          : undefined,
      latitude: item.latitude,
      longitude: item.longitude,
    };

    const ext = await gatherExternalData(item.latitude, item.longitude);
    const features = buildFeatures(inp, ext);

    await repo.addExample({
      features,
      label: Number(item.label),
      meta: { original: item, normalized: inp, ext },
      createdAt: new Date(),
    });
    ok++;
  }

  console.log(JSON.stringify({ success: true, inserted: ok }));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
