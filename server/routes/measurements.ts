import express, { Request, Response } from "express";
import CarbonMeasurement from "../models/CarbonMeasurement";
import Field from "../models/Field";
import { authenticateToken, requireFarmer } from "../middleware/auth";

const router = express.Router();

// Generate unique measurement ID
const generateMeasurementId = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const todayCount = await CarbonMeasurement.countDocuments({
    measurementDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
    },
  });

  const sequence = (todayCount + 1).toString().padStart(4, "0");
  return `MES${year}${month}${day}${sequence}`;
};

// Add new measurement
router.post(
  "/",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const {
        fieldId,
        measurementType,
        dataSource = "farmer-input",
        gpsLocation,
        photos = [],
        biomassData,
        soilData,
        riceData,
        environmentalData,
        notes,
      } = req.body;

      // Validate required fields
      if (!fieldId || !measurementType || !gpsLocation) {
        return res.status(400).json({
          success: false,
          message: "Field ID, measurement type, and GPS location are required",
        });
      }

      // Verify field ownership
      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found or not accessible",
        });
      }

      // Validate GPS location
      if (!gpsLocation.latitude || !gpsLocation.longitude) {
        return res.status(400).json({
          success: false,
          message: "Valid GPS coordinates required",
        });
      }

      // Validate measurement type against field crop type
      if (measurementType === "methane-emission" && field.cropType !== "rice") {
        return res.status(400).json({
          success: false,
          message:
            "Methane emission measurements are only applicable for rice fields",
        });
      }

      if (
        measurementType === "tree-growth" &&
        field.cropType !== "agroforestry"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tree growth measurements are only applicable for agroforestry fields",
        });
      }

      // Generate unique measurement ID
      const measurementId = await generateMeasurementId();

      // Calculate data quality score
      const dataQuality = calculateDataQuality({
        measurementType,
        photos,
        biomassData,
        soilData,
        riceData,
        environmentalData,
      });

      // Create measurement
      const measurement = new CarbonMeasurement({
        measurementId,
        farmerId,
        fieldId,
        measurementDate: new Date(),
        dataSource,
        measurementType,
        gpsLocation: {
          latitude: parseFloat(gpsLocation.latitude),
          longitude: parseFloat(gpsLocation.longitude),
          accuracy: gpsLocation.accuracy || 10,
        },
        photos: photos.map((photo: any) => ({
          url: photo.url,
          caption: photo.caption || "",
          timestamp: photo.timestamp ? new Date(photo.timestamp) : new Date(),
          gpsLocation: photo.gpsLocation,
        })),
        biomassData,
        soilData,
        riceData,
        environmentalData,
        dataQuality,
        verificationStatus: "pending",
        notes: notes?.trim(),
        isActive: true,
      });

      await measurement.save();

      // Populate field information for response
      await measurement.populate("fieldId", "fieldName cropType area");

      res.status(201).json({
        success: true,
        message: "Measurement recorded successfully",
        data: { measurement },
      });
    } catch (error) {
      console.error("Measurement creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record measurement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Calculate data quality score
function calculateDataQuality(data: any): any {
  let completeness = 0;
  let accuracy = 0;
  let consistency = 0;

  // Completeness check
  const requiredFields = ["measurementType", "photos"];
  const optionalFields = [
    "biomassData",
    "soilData",
    "riceData",
    "environmentalData",
  ];

  let providedRequired = 0;
  let providedOptional = 0;

  requiredFields.forEach((field) => {
    if (
      data[field] &&
      (Array.isArray(data[field]) ? data[field].length > 0 : true)
    ) {
      providedRequired++;
    }
  });

  optionalFields.forEach((field) => {
    if (data[field] && Object.keys(data[field]).length > 0) {
      providedOptional++;
    }
  });

  completeness =
    (providedRequired / requiredFields.length) * 70 +
    (providedOptional / optionalFields.length) * 30;

  // Accuracy check (basic validation)
  accuracy = 85; // Default accuracy, can be improved with AI validation

  // Consistency check
  consistency = 80; // Default consistency, can be improved with historical data comparison

  const overallScore = (completeness + accuracy + consistency) / 3;

  return {
    completeness: Math.round(completeness),
    accuracy: Math.round(accuracy),
    consistency: Math.round(consistency),
    overallScore: Math.round(overallScore),
  };
}

// Get measurements
router.get(
  "/",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const {
        page = 1,
        limit = 20,
        fieldId,
        measurementType,
        status,
        startDate,
        endDate,
      } = req.query;

      // Build query
      const query: any = { farmerId, isActive: true };
      if (fieldId) query.fieldId = fieldId;
      if (measurementType) query.measurementType = measurementType;
      if (status) query.verificationStatus = status;

      if (startDate || endDate) {
        query.measurementDate = {};
        if (startDate)
          query.measurementDate.$gte = new Date(startDate as string);
        if (endDate) query.measurementDate.$lte = new Date(endDate as string);
      }

      const measurements = await CarbonMeasurement.find(query)
        .populate("fieldId", "fieldName cropType area")
        .sort({ measurementDate: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await CarbonMeasurement.countDocuments(query);

      res.json({
        success: true,
        data: {
          measurements,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Measurements fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch measurements",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get specific measurement
router.get(
  "/:measurementId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { measurementId } = req.params;
      const farmerId = req.user.farmerId;

      const measurement = await CarbonMeasurement.findOne({
        _id: measurementId,
        farmerId,
        isActive: true,
      }).populate("fieldId", "fieldName cropType area coordinates");

      if (!measurement) {
        return res.status(404).json({
          success: false,
          message: "Measurement not found",
        });
      }

      res.json({
        success: true,
        data: { measurement },
      });
    } catch (error) {
      console.error("Measurement fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch measurement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Update measurement
router.put(
  "/:measurementId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { measurementId } = req.params;
      const farmerId = req.user.farmerId;
      const {
        photos,
        biomassData,
        soilData,
        riceData,
        environmentalData,
        notes,
      } = req.body;

      const measurement = await CarbonMeasurement.findOne({
        _id: measurementId,
        farmerId,
        isActive: true,
      });

      if (!measurement) {
        return res.status(404).json({
          success: false,
          message: "Measurement not found",
        });
      }

      // Check if measurement can be updated
      if (measurement.verificationStatus === "verified") {
        return res.status(400).json({
          success: false,
          message: "Cannot update verified measurements",
        });
      }

      // Update allowed fields
      if (photos) measurement.photos = photos;
      if (biomassData) measurement.biomassData = biomassData;
      if (soilData) measurement.soilData = soilData;
      if (riceData) measurement.riceData = riceData;
      if (environmentalData) measurement.environmentalData = environmentalData;
      if (notes) measurement.notes = notes.trim();

      // Recalculate data quality
      measurement.dataQuality = calculateDataQuality({
        measurementType: measurement.measurementType,
        photos: measurement.photos,
        biomassData: measurement.biomassData,
        soilData: measurement.soilData,
        riceData: measurement.riceData,
        environmentalData: measurement.environmentalData,
      });

      await measurement.save();

      res.json({
        success: true,
        message: "Measurement updated successfully",
        data: { measurement },
      });
    } catch (error) {
      console.error("Measurement update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update measurement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Delete measurement
router.delete(
  "/:measurementId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { measurementId } = req.params;
      const farmerId = req.user.farmerId;

      const measurement = await CarbonMeasurement.findOne({
        _id: measurementId,
        farmerId,
        isActive: true,
      });

      if (!measurement) {
        return res.status(404).json({
          success: false,
          message: "Measurement not found",
        });
      }

      // Check if measurement can be deleted
      if (measurement.verificationStatus === "verified") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete verified measurements",
        });
      }

      measurement.isActive = false;
      await measurement.save();

      res.json({
        success: true,
        message: "Measurement deleted successfully",
      });
    } catch (error) {
      console.error("Measurement deletion error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete measurement",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

export default router;
