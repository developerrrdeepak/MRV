import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
  _id: string;
  fieldId: string;
  farmerId: mongoose.Types.ObjectId;
  fieldName: string;
  area: number; // in acres
  cropType: "rice" | "agroforestry" | "mixed" | "other";
  cropVariety?: string;
  coordinates: {
    type: "Polygon";
    coordinates: number[][][]; // GeoJSON format
  };
  centerPoint: {
    latitude: number;
    longitude: number;
  };
  soilType: string;
  irrigationType: "rain-fed" | "irrigated" | "mixed";
  plantingDate?: Date;
  harvestDate?: Date;
  currentCrop?: {
    name: string;
    variety: string;
    plantingDate: Date;
    expectedHarvest: Date;
  };
  agroforestryDetails?: {
    treeSpecies: string[];
    treeDensity: number; // trees per acre
    treeAge: number; // average age in years
    plantingPattern: string;
    canopyCover: number; // percentage
  };
  riceDetails?: {
    variety: string;
    cultivationMethod: "conventional" | "sri" | "organic";
    waterManagement: string;
    seedingDate: Date;
    transplantingDate?: Date;
    floodingPeriods: Array<{
      startDate: Date;
      endDate: Date;
      floodDepth: number; // in cm
    }>;
  };
  isActive: boolean;
  registrationDate: Date;
  lastUpdated: Date;
}

const FieldSchema = new Schema<IField>(
  {
    fieldId: {
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
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      required: true,
      min: 0.1,
    },
    cropType: {
      type: String,
      required: true,
      enum: ["rice", "agroforestry", "mixed", "other"],
    },
    cropVariety: String,
    coordinates: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
    centerPoint: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    soilType: {
      type: String,
      required: true,
    },
    irrigationType: {
      type: String,
      required: true,
      enum: ["rain-fed", "irrigated", "mixed"],
    },
    plantingDate: Date,
    harvestDate: Date,
    currentCrop: {
      name: String,
      variety: String,
      plantingDate: Date,
      expectedHarvest: Date,
    },
    agroforestryDetails: {
      treeSpecies: [String],
      treeDensity: { type: Number, min: 0 },
      treeAge: { type: Number, min: 0 },
      plantingPattern: String,
      canopyCover: { type: Number, min: 0, max: 100 },
    },
    riceDetails: {
      variety: String,
      cultivationMethod: {
        type: String,
        enum: ["conventional", "sri", "organic"],
      },
      waterManagement: String,
      seedingDate: Date,
      transplantingDate: Date,
      floodingPeriods: [
        {
          startDate: Date,
          endDate: Date,
          floodDepth: Number,
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Create geospatial index for location queries
FieldSchema.index({ coordinates: "2dsphere" });
FieldSchema.index({ centerPoint: "2dsphere" });

// Index for efficient farmer field queries
FieldSchema.index({ farmerId: 1, isActive: 1 });

export default mongoose.model<IField>("Field", FieldSchema);
