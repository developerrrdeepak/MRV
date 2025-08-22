import express, { Request, Response } from "express";
import CarbonCredit from "../models/CarbonCredit";
import CarbonMeasurement from "../models/CarbonMeasurement";
import Field from "../models/Field";
import {
  authenticateToken,
  requireFarmer,
  requireVerifier,
} from "../middleware/auth";

const router = express.Router();

// Generate unique credit ID
const generateCreditId = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const monthlyCount = await CarbonCredit.countDocuments({
    createdDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    },
  });

  const sequence = (monthlyCount + 1).toString().padStart(4, "0");
  return `CC${year}${month}${sequence}`;
};

// Calculate carbon credits from measurements
router.post(
  "/calculate",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const {
        fieldId,
        measurementIds,
        calculationPeriod,
        methodology = "IPCC-2019",
      } = req.body;

      // Validate required fields
      if (
        !fieldId ||
        !measurementIds ||
        measurementIds.length === 0 ||
        !calculationPeriod
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Field ID, measurement IDs, and calculation period are required",
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

      // Verify measurements
      const measurements = await CarbonMeasurement.find({
        _id: { $in: measurementIds },
        farmerId,
        fieldId,
        verificationStatus: "verified",
        isActive: true,
      });

      if (measurements.length !== measurementIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some measurements not found or not verified",
        });
      }

      // Calculate carbon sequestration based on field type
      const carbonData = await calculateCarbonSequestration(
        field,
        measurements,
        calculationPeriod,
      );

      // Calculate credit details
      const creditDetails = calculateCreditDetails(carbonData, methodology);

      // Generate unique credit ID
      const creditId = await generateCreditId();

      // Calculate market price and payment details
      const pricePerCredit = await getCurrentCarbonPrice();
      const totalValue = creditDetails.creditsIssued * pricePerCredit;
      const farmerShare = 70; // 70% to farmer
      const platformShare = 30; // 30% to platform

      // Create carbon credit record
      const carbonCredit = new CarbonCredit({
        creditId,
        farmerId,
        fieldId,
        measurementIds,
        calculationPeriod: {
          startDate: new Date(calculationPeriod.startDate),
          endDate: new Date(calculationPeriod.endDate),
          durationMonths: calculateMonthsDifference(
            new Date(calculationPeriod.startDate),
            new Date(calculationPeriod.endDate),
          ),
        },
        carbonData,
        creditDetails: {
          ...creditDetails,
          vintage: new Date().getFullYear(),
          registry: "internal", // Can be updated later for external registries
        },
        verification: {
          status: "pending",
          confidence: carbonData.calculationMethod.includes("satellite")
            ? 85
            : 75,
          qualityScore: Math.round(
            measurements.reduce(
              (sum, m) => sum + m.dataQuality.overallScore,
              0,
            ) / measurements.length,
          ),
        },
        market: {
          pricePerCredit,
          totalValue,
          status: "pending",
        },
        payment: {
          totalEarnings: totalValue,
          farmerShare,
          platformShare,
          verificationCost: 0,
          transactionFee: totalValue * 0.02, // 2% transaction fee
          netEarnings: (totalValue * farmerShare) / 100 - totalValue * 0.02,
          paymentStatus: "pending",
        },
        metadata: {
          biodiversityImpact:
            field.cropType === "agroforestry"
              ? "Positive - Enhanced biodiversity through tree cover"
              : "Neutral",
          socialImpact: "Positive - Additional income for smallholder farmer",
          additionalBenefits: getAdditionalBenefits(field.cropType),
          sustainabilityGoals: [
            "SDG 13: Climate Action",
            "SDG 1: No Poverty",
            "SDG 15: Life on Land",
          ],
        },
        isActive: true,
        createdDate: new Date(),
      });

      await carbonCredit.save();

      // Populate related data for response
      await carbonCredit.populate([
        { path: "fieldId", select: "fieldName cropType area" },
        {
          path: "measurementIds",
          select:
            "measurementId measurementType measurementDate verificationStatus",
        },
      ]);

      res.status(201).json({
        success: true,
        message: "Carbon credits calculated successfully",
        data: { carbonCredit },
      });
    } catch (error) {
      console.error("Carbon credit calculation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate carbon credits",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Helper function to calculate carbon sequestration
async function calculateCarbonSequestration(
  field: any,
  measurements: any[],
  period: any,
) {
  const { cropType, area } = field;
  let totalCO2Sequestered = 0;
  let sequestrationRate = 0;
  let baselineEmissions = 0;
  let calculationMethod = "";

  if (cropType === "agroforestry") {
    // Agroforestry carbon calculation
    const biomassData = measurements.find((m) => m.biomassData)?.biomassData;

    if (biomassData) {
      // Simplified calculation: trees + soil carbon
      const treeCarbon = calculateTreeCarbon(biomassData, area);
      const soilCarbon = calculateSoilCarbon(measurements, area);

      totalCO2Sequestered = treeCarbon + soilCarbon;
      sequestrationRate = totalCO2Sequestered; // Per year
      baselineEmissions = area * 0.1; // Minimal baseline for agroforestry
      calculationMethod =
        "IPCC-2019 Agroforestry methodology with field measurements";
    }
  } else if (cropType === "rice") {
    // Rice carbon calculation (methane reduction)
    const riceData = measurements.find((m) => m.riceData)?.riceData;

    if (riceData) {
      // Calculate methane emission reduction
      const methaneReduction = calculateMethaneReduction(riceData, area);
      totalCO2Sequestered = methaneReduction;
      sequestrationRate = methaneReduction;
      baselineEmissions = area * 2.5; // Higher baseline for conventional rice
      calculationMethod =
        "IPCC-2019 Rice cultivation methodology with SRI practices";
    }
  }

  const netReduction = totalCO2Sequestered - baselineEmissions;

  return {
    totalCO2Sequestered: Math.max(0, totalCO2Sequestered),
    sequestrationRate,
    baselineEmissions,
    netReduction: Math.max(0, netReduction),
    calculationMethod,
    uncertaintyRange: {
      lower: totalCO2Sequestered * 0.8,
      upper: totalCO2Sequestered * 1.2,
    },
  };
}

// Helper functions for carbon calculations
function calculateTreeCarbon(biomassData: any, area: number): number {
  const { treeCount, averageTreeHeight, averageDbh, canopyCover } = biomassData;

  // Simplified allometric equation for tropical trees
  const biomassPerTree = 0.0673 * Math.pow(averageDbh, 2.085); // kg dry matter per tree
  const totalBiomass = treeCount * biomassPerTree; // kg
  const carbonContent = totalBiomass * 0.47; // 47% carbon content
  const co2Equivalent = carbonContent * 3.67; // CO2 equivalent

  return co2Equivalent / 1000 / area; // tonnes CO2 per acre
}

function calculateSoilCarbon(measurements: any[], area: number): number {
  const soilData = measurements.find((m) => m.soilData)?.soilData;

  if (!soilData) return 0;

  const { organicCarbonContent, soilDepth, bulkDensity } = soilData;

  // Soil carbon stock calculation
  const soilVolume = area * 4047 * (soilDepth / 100); // m3 (1 acre = 4047 m2)
  const soilMass = soilVolume * bulkDensity * 1000; // kg
  const carbonStock = soilMass * (organicCarbonContent / 100); // kg carbon
  const co2Equivalent = carbonStock * 3.67; // CO2 equivalent

  return co2Equivalent / 1000 / area; // tonnes CO2 per acre
}

function calculateMethaneReduction(riceData: any, area: number): number {
  const { cultivationMethod, floodingDuration, waterManagement } = riceData;

  let reductionFactor = 0;

  // Calculate reduction based on practices
  if (cultivationMethod === "sri") reductionFactor += 0.35; // 35% reduction
  if (cultivationMethod === "organic") reductionFactor += 0.2; // 20% reduction
  if (floodingDuration < 60) reductionFactor += 0.25; // 25% for reduced flooding

  const baselineEmission = area * 2.5; // tonnes CO2eq per acre baseline
  const reduction = baselineEmission * reductionFactor;

  return Math.min(reduction, baselineEmission * 0.8); // Max 80% reduction
}

function calculateCreditDetails(carbonData: any, methodology: string) {
  const { totalCO2Sequestered } = carbonData;

  return {
    creditsIssued: Math.floor(totalCO2Sequestered * 100) / 100, // Round to 2 decimal places
    creditType: "sequestration" as const,
    methodology,
  };
}

async function getCurrentCarbonPrice(): Promise<number> {
  // In a real implementation, this would fetch from a carbon market API
  // For now, return a reasonable price for Indian carbon markets
  return 800; // INR per credit
}

function calculateMonthsDifference(startDate: Date, endDate: Date): number {
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  return months - startDate.getMonth() + endDate.getMonth();
}

function getAdditionalBenefits(cropType: string): string[] {
  const benefits = ["Carbon sequestration", "Additional farmer income"];

  if (cropType === "agroforestry") {
    benefits.push(
      "Biodiversity enhancement",
      "Soil erosion control",
      "Water conservation",
    );
  } else if (cropType === "rice") {
    benefits.push(
      "Methane emission reduction",
      "Water conservation",
      "Soil health improvement",
    );
  }

  return benefits;
}

// Get farmer's carbon credits
router.get(
  "/",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const { page = 1, limit = 20, status, vintage } = req.query;

      // Build query
      const query: any = { farmerId, isActive: true };
      if (status) query["verification.status"] = status;
      if (vintage) query["creditDetails.vintage"] = Number(vintage);

      const credits = await CarbonCredit.find(query)
        .populate("fieldId", "fieldName cropType area")
        .populate(
          "measurementIds",
          "measurementId measurementType measurementDate",
        )
        .sort({ createdDate: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await CarbonCredit.countDocuments(query);

      res.json({
        success: true,
        data: {
          credits,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Carbon credits fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch carbon credits",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get specific carbon credit
router.get(
  "/:creditId",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const { creditId } = req.params;
      const farmerId = req.user.farmerId;

      const credit = await CarbonCredit.findOne({
        _id: creditId,
        farmerId,
        isActive: true,
      })
        .populate("fieldId", "fieldName cropType area coordinates")
        .populate(
          "measurementIds",
          "measurementId measurementType measurementDate dataQuality verificationStatus",
        );

      if (!credit) {
        return res.status(404).json({
          success: false,
          message: "Carbon credit not found",
        });
      }

      res.json({
        success: true,
        data: { credit },
      });
    } catch (error) {
      console.error("Carbon credit fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch carbon credit",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Verify carbon credit (admin/verifier only)
router.patch(
  "/:creditId/verify",
  authenticateToken,
  requireVerifier,
  async (req: Request, res: Response) => {
    try {
      const { creditId } = req.params;
      const { status, notes, qualityScore } = req.body;

      if (!["verified", "rejected", "needs-review"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification status",
        });
      }

      const credit = await CarbonCredit.findOne({
        _id: creditId,
        isActive: true,
      });

      if (!credit) {
        return res.status(404).json({
          success: false,
          message: "Carbon credit not found",
        });
      }

      // Update verification status
      credit.verification.status = status;
      credit.verification.verifiedBy = req.user.farmerId;
      credit.verification.verificationDate = new Date();
      credit.verification.verificationNotes = notes;
      if (qualityScore) credit.verification.qualityScore = qualityScore;

      // Update market status if verified
      if (status === "verified") {
        credit.market.status = "listed";
        credit.market.listedDate = new Date();
      }

      await credit.save();

      res.json({
        success: true,
        message: "Carbon credit verification updated successfully",
        data: { credit },
      });
    } catch (error) {
      console.error("Carbon credit verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update verification",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

export default router;
