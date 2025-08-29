import type { RequestHandler } from "express";
import Database from "../lib/database";
import { computeAGBCarbon, computeSoilCarbon } from "../../shared/carbon";
import type {
  CarbonEstimateRequest,
  CarbonEstimateResponse,
} from "../../shared/api";

async function ensureDb() {
  try {
    const db = Database.getInstance();
    // Attempt a lightweight operation to check connection
    try {
      db.getDb();
      return db;
    } catch {
      await db.connect();
      return db;
    }
  } catch (e) {
    console.error("[CARBON] DB connect error", e);
    throw e;
  }
}

export const estimateCarbon: RequestHandler = async (req, res) => {
  try {
    const body = req.body as CarbonEstimateRequest;

    if (!body || !body.mode || !body.payload) {
      return res.status(400).json({
        success: false,
        message: "mode and payload are required",
      });
    }

    let response: CarbonEstimateResponse | null = null;

    if (body.mode === "soil" || body.mode === "soil_gkg") {
      const result = computeSoilCarbon(
        body.mode === "soil"
          ? { kind: "soil", ...body.payload }
          : { kind: "soil_gkg", ...body.payload },
      );
      response = {
        success: true,
        type: "soil",
        carbon_t_ha: result.carbon_t_ha,
        co2e_t_ha: result.co2e_t_ha,
        details: result.details,
        timestamp: new Date().toISOString(),
      };
    }

    if (body.mode === "agb" || body.mode === "allometric") {
      const result = computeAGBCarbon(
        body.mode === "agb"
          ? { kind: "agb", ...body.payload }
          : { kind: "allometric", ...body.payload },
      );
      response = {
        success: true,
        type: "agb",
        carbon_t_ha: result.carbon_t_ha,
        co2e_t_ha: result.co2e_t_ha,
        details: result.details,
        timestamp: new Date().toISOString(),
      };
    }

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Unsupported mode. Use soil, soil_gkg, agb, or allometric.",
      });
    }

    // Persist to MongoDB if available
    try {
      const db = await ensureDb();
      const collection = db.getDb().collection("carbon_estimates");
      const result = await collection.insertOne({
        mode: body.mode,
        payload: body.payload,
        metadata: body.metadata ?? null,
        result: response,
        createdAt: new Date(),
      });
      response.id = result.insertedId.toString();
    } catch (err) {
      console.warn("[CARBON] Skipping DB persistence:", (err as Error).message);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("[CARBON] Estimation error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute carbon estimate",
    });
  }
};
