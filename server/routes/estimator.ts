import { RequestHandler } from "express";
import { EstimatorRequest, APIResponse, EstimatorResult } from "@shared/api";
import { estimateCarbon } from "../lib/models/estimator";

export const calculateEstimator: RequestHandler = async (req, res) => {
  try {
    const payload = req.body as EstimatorRequest;

    if (!payload || typeof payload.areaHectares !== "number" || !payload.projectType) {
      return res.status(400).json({ success: false, message: "Invalid input" } satisfies APIResponse);
    }

    const result: EstimatorResult = await estimateCarbon(payload);
    const response: APIResponse<EstimatorResult> = { success: true, data: result };
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Estimator failed", error: error?.message } satisfies APIResponse);
  }
};
