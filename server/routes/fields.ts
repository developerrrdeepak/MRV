import express, { Request, Response } from "express";
import Field, { IField } from "../models/Field";
import CarbonMeasurement from "../models/CarbonMeasurement";
import { authenticateToken, requireFarmer } from "../middleware/auth";

const router = express.Router();

// Generate unique field ID
const generateFieldId = async (farmerId: string): Promise<string> => {
  const farmerFields = await Field.countDocuments({ farmerId });
  const fieldNumber = (farmerFields + 1).toString().padStart(3, "0");
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);

  return `FLD${year}${fieldNumber}`;
};

// Add new field
router.post(
  "/",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const {
        fieldName,
        area,
        cropType,
        cropVariety,
        coordinates,
        centerPoint,
        soilType,
        irrigationType,
        currentCrop,
        agroforestryDetails,
        riceDetails,
      } = req.body;

      // Validate required fields
      if (
        !fieldName ||
        !area ||
        !cropType ||
        !coordinates ||
        !centerPoint ||
        !soilType ||
        !irrigationType
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Field name, area, crop type, coordinates, center point, soil type, and irrigation type are required",
        });
      }

      // Validate area
      if (area < 0.1) {
        return res.status(400).json({
          success: false,
          message: "Minimum field area should be 0.1 acres",
        });
      }

      // Validate coordinates (should be a valid polygon)
      if (
        !coordinates.type ||
        coordinates.type !== "Polygon" ||
        !coordinates.coordinates ||
        coordinates.coordinates.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid coordinates format. Must be a GeoJSON Polygon",
        });
      }

      // Validate center point
      if (!centerPoint.latitude || !centerPoint.longitude) {
        return res.status(400).json({
          success: false,
          message: "Valid center point coordinates required",
        });
      }

      // Validate crop-specific details
      if (cropType === "agroforestry" && !agroforestryDetails) {
        return res.status(400).json({
          success: false,
          message: "Agroforestry details required for agroforestry fields",
        });
      }

      if (cropType === "rice" && !riceDetails) {
        return res.status(400).json({
          success: false,
          message: "Rice cultivation details required for rice fields",
        });
      }

      // Generate unique field ID
      const fieldId = await generateFieldId(farmerId);

      // Create field
      const field = new Field({
        fieldId,
        farmerId,
        fieldName: fieldName.trim(),
        area: parseFloat(area),
        cropType,
        cropVariety: cropVariety?.trim(),
        coordinates,
        centerPoint: {
          latitude: parseFloat(centerPoint.latitude),
          longitude: parseFloat(centerPoint.longitude),
        },
        soilType: soilType.trim(),
        irrigationType,
        currentCrop,
        agroforestryDetails,
        riceDetails,
        isActive: true,
        registrationDate: new Date(),
        lastUpdated: new Date(),
      });

      await field.save();

      res.status(201).json({
        success: true,
        message: "Field registered successfully",
        data: { field },
      });
    } catch (error) {
      console.error("Field registration error:", error);
      res.status(500).json({
        success: false,
        message: "Field registration failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get farmer's fields
router.get(
  "/",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const { cropType, active = "true" } = req.query;

      // Build query
      const query: any = { farmerId };
      if (cropType) query.cropType = cropType;
      if (active === "true") query.isActive = true;

      const fields = await Field.find(query).sort({ registrationDate: -1 });

      // Get measurement counts for each field
      const fieldsWithStats = await Promise.all(
        fields.map(async (field) => {
          const measurementCount = await CarbonMeasurement.countDocuments({
            fieldId: field._id,
            isActive: true,
          });

          const lastMeasurement = await CarbonMeasurement.findOne({
            fieldId: field._id,
            isActive: true,
          }).sort({ measurementDate: -1 });

          return {
            ...field.toObject(),
            measurementCount,
            lastMeasurementDate: lastMeasurement?.measurementDate,
          };
        }),
      );

      res.json({
        success: true,
        data: { fields: fieldsWithStats },
      });
    } catch (error) {
      console.error("Fields fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch fields",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get specific field details
router.get(
  "/:fieldId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { fieldId } = req.params;
      const farmerId = req.user.farmerId;

      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Get recent measurements for this field
      const recentMeasurements = await CarbonMeasurement.find({
        fieldId: field._id,
        isActive: true,
      })
        .sort({ measurementDate: -1 })
        .limit(10);

      res.json({
        success: true,
        data: {
          field,
          recentMeasurements,
        },
      });
    } catch (error) {
      console.error("Field fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch field details",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Update field details
router.put(
  "/:fieldId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { fieldId } = req.params;
      const farmerId = req.user.farmerId;
      const {
        fieldName,
        cropVariety,
        soilType,
        irrigationType,
        currentCrop,
        agroforestryDetails,
        riceDetails,
      } = req.body;

      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Update allowed fields
      if (fieldName) field.fieldName = fieldName.trim();
      if (cropVariety) field.cropVariety = cropVariety.trim();
      if (soilType) field.soilType = soilType.trim();
      if (irrigationType) field.irrigationType = irrigationType;
      if (currentCrop) field.currentCrop = currentCrop;
      if (agroforestryDetails && field.cropType === "agroforestry") {
        field.agroforestryDetails = agroforestryDetails;
      }
      if (riceDetails && field.cropType === "rice") {
        field.riceDetails = riceDetails;
      }

      field.lastUpdated = new Date();
      await field.save();

      res.json({
        success: true,
        message: "Field updated successfully",
        data: { field },
      });
    } catch (error) {
      console.error("Field update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update field",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Update field crop information
router.patch(
  "/:fieldId/crop",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { fieldId } = req.params;
      const farmerId = req.user.farmerId;
      const { currentCrop } = req.body;

      if (!currentCrop || !currentCrop.name || !currentCrop.plantingDate) {
        return res.status(400).json({
          success: false,
          message: "Crop name and planting date are required",
        });
      }

      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      field.currentCrop = {
        name: currentCrop.name.trim(),
        variety: currentCrop.variety?.trim() || "",
        plantingDate: new Date(currentCrop.plantingDate),
        expectedHarvest: currentCrop.expectedHarvest
          ? new Date(currentCrop.expectedHarvest)
          : new Date(),
      };

      field.lastUpdated = new Date();
      await field.save();

      res.json({
        success: true,
        message: "Crop information updated successfully",
        data: { field },
      });
    } catch (error) {
      console.error("Crop update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update crop information",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Deactivate field
router.delete(
  "/:fieldId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { fieldId } = req.params;
      const farmerId = req.user.farmerId;

      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Check if field has active measurements
      const activeMeasurements = await CarbonMeasurement.countDocuments({
        fieldId: field._id,
        isActive: true,
        verificationStatus: "pending",
      });

      if (activeMeasurements > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot deactivate field with pending measurements. Please complete verification first.",
        });
      }

      field.isActive = false;
      field.lastUpdated = new Date();
      await field.save();

      res.json({
        success: true,
        message: "Field deactivated successfully",
      });
    } catch (error) {
      console.error("Field deactivation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to deactivate field",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get field measurements
router.get(
  "/:fieldId/measurements",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { fieldId } = req.params;
      const farmerId = req.user.farmerId;
      const { page = 1, limit = 20, measurementType } = req.query;

      // Verify field ownership
      const field = await Field.findOne({
        _id: fieldId,
        farmerId,
        isActive: true,
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Build query
      const query: any = { fieldId, isActive: true };
      if (measurementType) query.measurementType = measurementType;

      const measurements = await CarbonMeasurement.find(query)
        .sort({ measurementDate: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await CarbonMeasurement.countDocuments(query);

      res.json({
        success: true,
        data: {
          field: {
            fieldId: field.fieldId,
            fieldName: field.fieldName,
            cropType: field.cropType,
            area: field.area,
          },
          measurements,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Field measurements fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch field measurements",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

export default router;
