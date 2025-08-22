import express, { Request, Response } from "express";
import Farmer from "../models/Farmer";
import Field from "../models/Field";
import CarbonMeasurement from "../models/CarbonMeasurement";
import CarbonCredit from "../models/CarbonCredit";
import Payment from "../models/Payment";
import {
  authenticateToken,
  requireFarmer,
  requireAdmin,
} from "../middleware/auth";

const router = express.Router();

// Get farmer dashboard data
router.get(
  "/dashboard",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;

      // Fetch farmer details
      const farmer = await Farmer.findById(farmerId).select("-password");
      if (!farmer) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found",
        });
      }

      // Fetch farmer's fields
      const fields = await Field.find({ farmerId, isActive: true });

      // Fetch recent measurements
      const recentMeasurements = await CarbonMeasurement.find({
        farmerId,
        isActive: true,
      })
        .sort({ measurementDate: -1 })
        .limit(10)
        .populate("fieldId", "fieldName cropType");

      // Fetch carbon credits
      const carbonCredits = await CarbonCredit.find({
        farmerId,
        isActive: true,
      })
        .sort({ createdDate: -1 })
        .populate("fieldId", "fieldName cropType");

      // Fetch payment history
      const payments = await Payment.find({
        farmerId,
        isActive: true,
      })
        .sort({ "dates.initiatedDate": -1 })
        .limit(10);

      // Calculate dashboard statistics
      const totalFields = fields.length;
      const totalArea = fields.reduce((sum, field) => sum + field.area, 0);
      const totalCredits = carbonCredits.reduce(
        (sum, credit) => sum + credit.creditDetails.creditsIssued,
        0,
      );
      const totalEarnings = payments
        .filter((p) => p.transaction.status === "completed")
        .reduce((sum, payment) => sum + payment.paymentDetails.amount, 0);

      // Recent activity summary
      const pendingMeasurements = recentMeasurements.filter(
        (m) => m.verificationStatus === "pending",
      ).length;
      const verifiedCredits = carbonCredits.filter(
        (c) => c.verification.status === "verified",
      ).length;
      const pendingPayments = payments.filter(
        (p) => p.transaction.status === "pending",
      ).length;

      // Monthly earnings for chart
      const monthlyEarnings = await Payment.aggregate([
        {
          $match: {
            farmerId: farmer._id,
            "transaction.status": "completed",
            "dates.completedDate": {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 11,
                1,
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$dates.completedDate" },
              month: { $month: "$dates.completedDate" },
            },
            earnings: { $sum: "$paymentDetails.amount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      res.json({
        success: true,
        data: {
          farmer: {
            name: farmer.name,
            farmerId: farmer.farmerId,
            phone: farmer.phone,
            verificationStatus: farmer.verificationStatus,
            registrationDate: farmer.registrationDate,
            totalCarbonCredits: farmer.totalCarbonCredits,
            totalEarnings: farmer.totalEarnings,
          },
          statistics: {
            totalFields,
            totalArea: parseFloat(totalArea.toFixed(2)),
            totalCredits: parseFloat(totalCredits.toFixed(2)),
            totalEarnings: parseFloat(totalEarnings.toFixed(2)),
            pendingMeasurements,
            verifiedCredits,
            pendingPayments,
          },
          recentMeasurements: recentMeasurements.slice(0, 5),
          carbonCredits: carbonCredits.slice(0, 5),
          recentPayments: payments.slice(0, 5),
          monthlyEarnings,
        },
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Get farmer's fields
router.get(
  "/fields",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;

      const fields = await Field.find({
        farmerId,
        isActive: true,
      }).sort({ registrationDate: -1 });

      // Get measurement counts for each field
      const fieldsWithStats = await Promise.all(
        fields.map(async (field) => {
          const measurementCount = await CarbonMeasurement.countDocuments({
            fieldId: field._id,
            isActive: true,
          });

          const creditCount = await CarbonCredit.countDocuments({
            fieldId: field._id,
            isActive: true,
          });

          return {
            ...field.toObject(),
            measurementCount,
            creditCount,
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

// Get farmer's measurements
router.get(
  "/measurements",
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
      } = req.query;

      // Build query
      const query: any = { farmerId, isActive: true };
      if (fieldId) query.fieldId = fieldId;
      if (measurementType) query.measurementType = measurementType;
      if (status) query.verificationStatus = status;

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

// Get farmer's carbon credits
router.get(
  "/carbon-credits",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const { page = 1, limit = 20, status } = req.query;

      // Build query
      const query: any = { farmerId, isActive: true };
      if (status) query["verification.status"] = status;

      const credits = await CarbonCredit.find(query)
        .populate("fieldId", "fieldName cropType area")
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

// Get farmer's payment history
router.get(
  "/payments",
  authenticateToken,
  requireFarmer,
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user.farmerId;
      const { page = 1, limit = 20, status } = req.query;

      // Build query
      const query: any = { farmerId, isActive: true };
      if (status) query["transaction.status"] = status;

      const payments = await Payment.find(query)
        .populate("creditIds", "creditId creditDetails.creditsIssued")
        .sort({ "dates.initiatedDate": -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Payment.countDocuments(query);

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Payments fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payments",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Admin: Get all farmers
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        state,
        district,
        verificationStatus,
      } = req.query;

      // Build query
      const query: any = { isActive: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { farmerId: { $regex: search, $options: "i" } },
        ];
      }

      if (state) query["address.state"] = state;
      if (district) query["address.district"] = district;
      if (verificationStatus) query.verificationStatus = verificationStatus;

      const farmers = await Farmer.find(query)
        .select("-password")
        .sort({ registrationDate: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Farmer.countDocuments(query);

      res.json({
        success: true,
        data: {
          farmers,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Farmers list fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch farmers",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// Admin: Update farmer verification status
router.patch(
  "/:farmerId/verification",
  authenticateToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { farmerId } = req.params;
      const { verificationStatus, notes } = req.body;

      if (!["pending", "verified", "rejected"].includes(verificationStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification status",
        });
      }

      const farmer = await Farmer.findById(farmerId);
      if (!farmer) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found",
        });
      }

      farmer.verificationStatus = verificationStatus;
      if (notes) {
        farmer.notes = notes;
      }

      await farmer.save();

      res.json({
        success: true,
        message: "Farmer verification status updated successfully",
        data: { farmer: farmer.toObject() },
      });
    } catch (error) {
      console.error("Verification update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update verification status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

export default router;
