import mongoose, { Schema, Document } from "mongoose";

export interface ICarbonCredit extends Document {
  _id: string;
  creditId: string;
  farmerId: mongoose.Types.ObjectId;
  fieldId: mongoose.Types.ObjectId;
  measurementIds: mongoose.Types.ObjectId[];

  // Credit calculation period
  calculationPeriod: {
    startDate: Date;
    endDate: Date;
    durationMonths: number;
  };

  // Carbon sequestration data
  carbonData: {
    totalCO2Sequestered: number; // tonnes CO2
    sequestrationRate: number; // tonnes CO2/year
    baselineEmissions: number; // tonnes CO2/year
    netReduction: number; // tonnes CO2/year
    calculationMethod: string;
    uncertaintyRange: {
      lower: number; // tonnes CO2
      upper: number; // tonnes CO2
    };
  };

  // Credit details
  creditDetails: {
    creditsIssued: number; // number of carbon credits
    creditType: "sequestration" | "emission-reduction" | "mixed";
    methodology: string; // e.g., 'IPCC-2019', 'Verra-VCS', 'Gold-Standard'
    vintage: number; // year
    serialNumber?: string;
    registry: "verra" | "gold-standard" | "indian-carbon-exchange" | "internal";
  };

  // Verification and quality
  verification: {
    status: "pending" | "verified" | "rejected" | "expired";
    verifiedBy?: mongoose.Types.ObjectId;
    verificationDate?: Date;
    verificationReport?: string;
    thirdPartyVerifier?: string;
    confidence: number; // percentage
    qualityScore: number; // percentage
  };

  // Market and pricing
  market: {
    pricePerCredit: number; // INR
    totalValue: number; // INR
    marketPrice?: number; // current market rate
    status: "pending" | "listed" | "sold" | "retired" | "cancelled";
    listedDate?: Date;
    soldDate?: Date;
    buyerId?: string;
    retiredDate?: Date;
    retiredReason?: string;
  };

  // Payment and earnings
  payment: {
    totalEarnings: number; // INR
    farmerShare: number; // percentage
    platformShare: number; // percentage
    verificationCost: number; // INR
    transactionFee: number; // INR
    netEarnings: number; // INR
    paymentStatus: "pending" | "processing" | "paid" | "failed";
    paymentDate?: Date;
    paymentReference?: string;
  };

  // Additional metadata
  metadata: {
    biodiversityImpact?: string;
    socialImpact?: string;
    additionalBenefits?: string[];
    sustainabilityGoals?: string[];
    certifications?: string[];
  };

  // System tracking
  isActive: boolean;
  createdDate: Date;
  lastUpdated: Date;
  expiryDate?: Date;
  notes?: string;
}

const CarbonCreditSchema = new Schema<ICarbonCredit>(
  {
    creditId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
      index: true,
    },
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: true,
      index: true,
    },
    measurementIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "CarbonMeasurement",
      },
    ],

    calculationPeriod: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      durationMonths: { type: Number, required: true, min: 1 },
    },

    carbonData: {
      totalCO2Sequestered: { type: Number, required: true, min: 0 },
      sequestrationRate: { type: Number, required: true, min: 0 },
      baselineEmissions: { type: Number, required: true, min: 0 },
      netReduction: { type: Number, required: true },
      calculationMethod: { type: String, required: true },
      uncertaintyRange: {
        lower: { type: Number, required: true },
        upper: { type: Number, required: true },
      },
    },

    creditDetails: {
      creditsIssued: { type: Number, required: true, min: 0 },
      creditType: {
        type: String,
        required: true,
        enum: ["sequestration", "emission-reduction", "mixed"],
      },
      methodology: { type: String, required: true },
      vintage: { type: Number, required: true },
      serialNumber: String,
      registry: {
        type: String,
        required: true,
        enum: ["verra", "gold-standard", "indian-carbon-exchange", "internal"],
      },
    },

    verification: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected", "expired"],
        default: "pending",
        index: true,
      },
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      verificationDate: Date,
      verificationReport: String,
      thirdPartyVerifier: String,
      confidence: { type: Number, min: 0, max: 100, default: 0 },
      qualityScore: { type: Number, min: 0, max: 100, default: 0 },
    },

    market: {
      pricePerCredit: { type: Number, required: true, min: 0 },
      totalValue: { type: Number, required: true, min: 0 },
      marketPrice: { type: Number, min: 0 },
      status: {
        type: String,
        enum: ["pending", "listed", "sold", "retired", "cancelled"],
        default: "pending",
        index: true,
      },
      listedDate: Date,
      soldDate: Date,
      buyerId: String,
      retiredDate: Date,
      retiredReason: String,
    },

    payment: {
      totalEarnings: { type: Number, required: true, min: 0 },
      farmerShare: { type: Number, required: true, min: 0, max: 100 },
      platformShare: { type: Number, required: true, min: 0, max: 100 },
      verificationCost: { type: Number, min: 0, default: 0 },
      transactionFee: { type: Number, min: 0, default: 0 },
      netEarnings: { type: Number, required: true, min: 0 },
      paymentStatus: {
        type: String,
        enum: ["pending", "processing", "paid", "failed"],
        default: "pending",
        index: true,
      },
      paymentDate: Date,
      paymentReference: String,
    },

    metadata: {
      biodiversityImpact: String,
      socialImpact: String,
      additionalBenefits: [String],
      sustainabilityGoals: [String],
      certifications: [String],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for efficient queries
CarbonCreditSchema.index({ farmerId: 1, "verification.status": 1 });
CarbonCreditSchema.index({ "creditDetails.vintage": 1, "market.status": 1 });
CarbonCreditSchema.index({ "payment.paymentStatus": 1, createdDate: -1 });
CarbonCreditSchema.index({ "calculationPeriod.endDate": 1 });

// Virtual for total active credits
CarbonCreditSchema.virtual("isValid").get(function () {
  return (
    this.isActive &&
    this.verification.status === "verified" &&
    (!this.expiryDate || this.expiryDate > new Date())
  );
});

export default mongoose.model<ICarbonCredit>(
  "CarbonCredit",
  CarbonCreditSchema,
);
