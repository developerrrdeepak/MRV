import { RequestHandler } from "express";
import {
  APIResponse,
  MLIngestRequest,
  MLTrainResponse,
  EstimatorRequest,
} from "@shared/api";
import { MLRepository } from "../lib/ml/repository";
import { gatherExternalData } from "../lib/ml/dataSources";
import { buildFeatures } from "../lib/ml/features";
import { trainLinearRegression } from "../lib/ml/linear";

const repo = MLRepository.getInstance();

export const ingestExample: RequestHandler = async (req, res) => {
  try {
    const body = req.body as MLIngestRequest;
    if (typeof body?.label !== "number" || !isFinite(body.label)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "label is required and must be a number",
        } satisfies APIResponse);
    }

    const lat =
      typeof body.latitude === "number"
        ? body.latitude
        : body.estimatorInput?.latitude;
    const lon =
      typeof body.longitude === "number"
        ? body.longitude
        : body.estimatorInput?.longitude;

    const ext = await gatherExternalData(lat, lon);
    const features = buildFeatures(
      {
        ...(body.estimatorInput || {}),
        latitude: lat,
        longitude: lon,
      } as Partial<EstimatorRequest>,
      ext,
    );

    await repo.addExample({
      features,
      label: body.label,
      meta: { estimatorInput: body.estimatorInput, lat, lon, ext },
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: "example ingested",
    } satisfies APIResponse);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "failed to ingest",
        error: error?.message,
      } satisfies APIResponse);
  }
};

export const trainModel: RequestHandler = async (_req, res) => {
  try {
    const examples = await repo.getAllExamples();
    if (examples.length < 10) {
      const response: MLTrainResponse = {
        success: false,
        message: "not enough training examples (min 10)",
      };
      return res.status(400).json(response);
    }

    const X = examples.map((e) => e.features);
    const y = examples.map((e) => e.label);
    const result = trainLinearRegression(X, y, {
      learningRate: 0.02,
      epochs: 2000,
      l2: 0.0005,
    });

    const version = await repo.nextVersion();
    await repo.saveModel({
      name: "carbonEstimatorV1",
      version,
      createdAt: new Date(),
      model: result.model,
      metrics: { rmse: result.rmse, r2: result.r2 },
      trainingCount: examples.length,
    });

    const response: MLTrainResponse = {
      success: true,
      model: {
        name: "carbonEstimatorV1",
        version,
        metrics: { rmse: result.rmse, r2: result.r2 },
        trainingCount: examples.length,
        createdAt: new Date().toISOString(),
      },
    };
    res.json(response);
  } catch (error: any) {
    const response: MLTrainResponse = {
      success: false,
      message: error?.message || "training failed",
    };
    res.status(500).json(response);
  }
};

export const getModelInfo: RequestHandler = async (_req, res) => {
  try {
    const m = await repo.getLatestModel();
    if (!m)
      return res
        .status(404)
        .json({ success: false, message: "no model" } satisfies APIResponse);
    res.json({
      success: true,
      data: {
        name: m.name,
        version: m.version,
        createdAt: m.createdAt,
        metrics: m.metrics,
        trainingCount: m.trainingCount,
      },
    } satisfies APIResponse);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "failed",
        error: error?.message,
      } satisfies APIResponse);
  }
};
