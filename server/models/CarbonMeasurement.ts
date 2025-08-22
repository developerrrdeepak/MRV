import mongoose, { Schema, Document } from "mongoose";

export interface ICarbonMeasurement extends Document {
  _id: string;
  measurementId: string;
  farmerId: mongoose.Types.ObjectId;
  fieldId: mongoose.Types.ObjectId;
  measurementDate: Date;
  dataSource:
    | "farmer-input"
    | "satellite"
    | "iot-sensor"
    | "field-visit"
    | "drone";
  measurementType:
    | "biomass"
    | "soil-carbon"
    | "methane-emission"
    | "tree-growth"
    | "yield";

  // General measurements
  gpsLocation: {
    latitude: number;
    longitude: number;
    accuracy: number; // in meters
  };

  // Photos and documentation
  photos: Array<{
    url: string;
    caption: string;
    timestamp: Date;
    gpsLocation?: {
      latitude: number;
      longitude: number;
    };
  }>;

  // Biomass measurements (for agroforestry)
  biomassData?: {
    treeCount: number;
    averageTreeHeight: number; // in meters
    averageDbh: number; // diameter at breast height in cm
    canopyCover: number; // percentage
    understoryBiomass: number; // estimated kg/acre
    deadWoodVolume?: number; // m3/acre
  };

  // Soil carbon measurements
  soilData?: {
    soilDepth: number; // cm
    organicCarbonContent: number; // percentage
    bulkDensity: number; // g/cm3
    ph: number;
    moisture: number; // percentage
    temperature: number; // celsius
    sampleMethod: string;
  };

  // Rice-specific measurements
  riceData?: {
    plantHeight: number; // cm
    tillerCount: number;
    panicleLength: number; // cm
    grainYield: number; // kg/acre
    biomassYield: number; // kg/acre
    waterLevel: number; // cm above soil
    floodingDuration: number; // days
    methaneFlux?: number; // mg CH4/m2/day
  };

  // Environmental data
  environmentalData?: {
    temperature: number; // celsius
    humidity: number; // percentage
    rainfall: number; // mm
    windSpeed: number; // km/h
    solarRadiation?: number; // W/m2
  };

  // Calculated values
  carbonSequestration?: {
    estimatedCO2Sequestered: number; // tonnes CO2/year
    calculationMethod: string;
    confidence: number; // percentage
  };

  // Verification status
  verificationStatus: "pending" | "verified" | "rejected" | "needs-review";
  verifiedBy?: mongoose.Types.ObjectId;
  verificationDate?: Date;
  verificationNotes?: string;

  // Quality scores
  dataQuality: {
    completeness: number; // percentage
    accuracy: number; // percentage
    consistency: number; // percentage
    overallScore: number; // percentage
  };

  notes?: string;
  isActive: boolean;
}

const CarbonMeasurementSchema = new Schema<ICarbonMeasurement>(
  {
    measurementId: {
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
    measurementDate: {
      type: Date,
      required: true,
      index: true,
    },
    dataSource: {
      type: String,
      required: true,
      enum: ["farmer-input", "satellite", "iot-sensor", "field-visit", "drone"],
    },
    measurementType: {
      type: String,
      required: true,
      enum: [
        "biomass",
        "soil-carbon",
        "methane-emission",
        "tree-growth",
        "yield",
      ],
    },

    gpsLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      accuracy: { type: Number, required: true },
    },

    photos: [
      {
        url: { type: String, required: true },
        caption: String,
        timestamp: { type: Date, default: Date.now },
        gpsLocation: {
          latitude: Number,
          longitude: Number,
        },
      },
    ],

    biomassData: {
      treeCount: { type: Number, min: 0 },
      averageTreeHeight: { type: Number, min: 0 },
      averageDbh: { type: Number, min: 0 },
      canopyCover: { type: Number, min: 0, max: 100 },
      understoryBiomass: { type: Number, min: 0 },
      deadWoodVolume: { type: Number, min: 0 },
    },

    soilData: {
      soilDepth: { type: Number, min: 0 },
      organicCarbonContent: { type: Number, min: 0, max: 100 },
      bulkDensity: { type: Number, min: 0 },
      ph: { type: Number, min: 0, max: 14 },
      moisture: { type: Number, min: 0, max: 100 },
      temperature: Number,
      sampleMethod: String,
    },

    riceData: {
      plantHeight: { type: Number, min: 0 },
      tillerCount: { type: Number, min: 0 },
      panicleLength: { type: Number, min: 0 },
      grainYield: { type: Number, min: 0 },
      biomassYield: { type: Number, min: 0 },
      waterLevel: { type: Number, min: 0 },
      floodingDuration: { type: Number, min: 0 },
      methaneFlux: Number,
    },

    environmentalData: {
      temperature: Number,
      humidity: { type: Number, min: 0, max: 100 },
      rainfall: { type: Number, min: 0 },
      windSpeed: { type: Number, min: 0 },
      solarRadiation: { type: Number, min: 0 },
    },

    carbonSequestration: {
      estimatedCO2Sequestered: { type: Number, min: 0 },
      calculationMethod: String,
      confidence: { type: Number, min: 0, max: 100 },
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "needs-review"],
      default: "pending",
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verificationDate: Date,
    verificationNotes: String,

    dataQuality: {
      completeness: { type: Number, min: 0, max: 100, default: 0 },
      accuracy: { type: Number, min: 0, max: 100, default: 0 },
      consistency: { type: Number, min: 0, max: 100, default: 0 },
      overallScore: { type: Number, min: 0, max: 100, default: 0 },
    },

    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for efficient queries
CarbonMeasurementSchema.index({ farmerId: 1, measurementDate: -1 });
CarbonMeasurementSchema.index({ fieldId: 1, measurementType: 1 });
CarbonMeasurementSchema.index({ verificationStatus: 1, measurementDate: -1 });
CarbonMeasurementSchema.index({
  "gpsLocation.latitude": 1,
  "gpsLocation.longitude": 1,
});

export default mongoose.model<ICarbonMeasurement>(
  "CarbonMeasurement",
  CarbonMeasurementSchema,
);
