import mongoose, { Schema, Document } from "mongoose";

export interface IFieldMeasurement extends Document {
  _id: string;
  measurementId: string;
  farmer: mongoose.Types.ObjectId; // Reference to Farmer
  project: mongoose.Types.ObjectId; // Reference to CarbonProject
  location: {
    plotId: string; // Specific plot/field identifier
    coordinates: {
      latitude: number;
      longitude: number;
    };
    area: number; // Area measured in hectares
  };
  measurementType:
    | "biomass"
    | "soil_carbon"
    | "tree_count"
    | "crop_yield"
    | "water_usage"
    | "satellite_data"
    | "other";
  data: {
    // Biomass measurements
    aboveGroundBiomass?: number; // kg/hectare
    belowGroundBiomass?: number; // kg/hectare
    treeDensity?: number; // trees per hectare
    averageTreeHeight?: number; // meters
    averageTreeDiameter?: number; // cm (DBH - Diameter at Breast Height)

    // Soil measurements
    soilCarbonContent?: number; // percentage
    soilOrganicMatter?: number; // percentage
    soilPH?: number;
    soilMoisture?: number; // percentage
    soilDepth?: number; // cm

    // Crop measurements
    cropType?: string;
    cropYield?: number; // kg/hectare
    cropStage?:
      | "sowing"
      | "germination"
      | "vegetative"
      | "flowering"
      | "fruiting"
      | "harvest";

    // Environmental data
    temperature?: number; // Celsius
    humidity?: number; // percentage
    rainfall?: number; // mm
    windSpeed?: number; // km/h

    // Water usage
    irrigationAmount?: number; // liters per hectare
    waterSource?: "groundwater" | "surface_water" | "rainwater" | "recycled";

    // Satellite/Remote sensing data
    ndvi?: number; // Normalized Difference Vegetation Index
    evi?: number; // Enhanced Vegetation Index
    lai?: number; // Leaf Area Index

    // Additional measurements
    customMeasurements?: [
      {
        parameter: string;
        value: number;
        unit: string;
      },
    ];
  };
  methodology: {
    measuredBy: string; // Name of person who took measurement
    measurementMethod:
      | "manual"
      | "gps"
      | "drone"
      | "satellite"
      | "sensor"
      | "app";
    equipment?: string; // Equipment used
    calibrationDate?: Date; // When equipment was last calibrated
    weatherConditions?: string;
    samplingMethod?: string; // Random, systematic, stratified, etc.
    sampleSize?: number; // Number of samples taken
  };
  quality: {
    accuracy?: number; // Estimated accuracy percentage
    precision?: number; // Number of decimal places
    uncertainty?: number; // Measurement uncertainty
    validated: boolean; // Has measurement been validated
    validatedBy?: string; // Who validated it
    validationDate?: Date;
    comments?: string; // Quality control comments
  };
  photos: string[]; // Photo file paths/URLs
  gpsTrack?: {
    coordinates: number[][]; // Array of [longitude, latitude] points
    timestamps: Date[]; // Corresponding timestamps
  };
  carbonCalculation?: {
    carbonStored: number; // tCO2e
    carbonEmitted?: number; // tCO2e
    netCarbon: number; // tCO2e (stored - emitted)
    calculationMethod: string;
    calculatedBy: string;
    calculatedDate: Date;
    verified: boolean;
  };
  sync: {
    deviceId?: string; // Mobile device/sensor ID
    localId?: string; // Local storage ID on device
    syncedAt: Date;
    uploadedFrom?: "mobile_app" | "web_portal" | "api" | "sensor_network";
  };
  measurementDate: Date;
  createdDate: Date;
  lastUpdated: Date;
}

const FieldMeasurementSchema = new Schema<IFieldMeasurement>(
  {
    measurementId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "CarbonProject",
      required: true,
    },
    location: {
      plotId: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true, min: -90, max: 90 },
        longitude: { type: Number, required: true, min: -180, max: 180 },
      },
      area: { type: Number, required: true, min: 0 },
    },
    measurementType: {
      type: String,
      required: true,
      enum: [
        "biomass",
        "soil_carbon",
        "tree_count",
        "crop_yield",
        "water_usage",
        "satellite_data",
        "other",
      ],
    },
    data: {
      // Biomass measurements
      aboveGroundBiomass: { type: Number, min: 0 },
      belowGroundBiomass: { type: Number, min: 0 },
      treeDensity: { type: Number, min: 0 },
      averageTreeHeight: { type: Number, min: 0 },
      averageTreeDiameter: { type: Number, min: 0 },

      // Soil measurements
      soilCarbonContent: { type: Number, min: 0, max: 100 },
      soilOrganicMatter: { type: Number, min: 0, max: 100 },
      soilPH: { type: Number, min: 0, max: 14 },
      soilMoisture: { type: Number, min: 0, max: 100 },
      soilDepth: { type: Number, min: 0 },

      // Crop measurements
      cropType: String,
      cropYield: { type: Number, min: 0 },
      cropStage: {
        type: String,
        enum: [
          "sowing",
          "germination",
          "vegetative",
          "flowering",
          "fruiting",
          "harvest",
        ],
      },

      // Environmental data
      temperature: Number,
      humidity: { type: Number, min: 0, max: 100 },
      rainfall: { type: Number, min: 0 },
      windSpeed: { type: Number, min: 0 },

      // Water usage
      irrigationAmount: { type: Number, min: 0 },
      waterSource: {
        type: String,
        enum: ["groundwater", "surface_water", "rainwater", "recycled"],
      },

      // Satellite/Remote sensing data
      ndvi: { type: Number, min: -1, max: 1 },
      evi: { type: Number, min: -1, max: 1 },
      lai: { type: Number, min: 0 },

      // Additional measurements
      customMeasurements: [
        {
          parameter: { type: String, required: true },
          value: { type: Number, required: true },
          unit: { type: String, required: true },
        },
      ],
    },
    methodology: {
      measuredBy: { type: String, required: true },
      measurementMethod: {
        type: String,
        required: true,
        enum: ["manual", "gps", "drone", "satellite", "sensor", "app"],
      },
      equipment: String,
      calibrationDate: Date,
      weatherConditions: String,
      samplingMethod: String,
      sampleSize: { type: Number, min: 1 },
    },
    quality: {
      accuracy: { type: Number, min: 0, max: 100 },
      precision: { type: Number, min: 0 },
      uncertainty: { type: Number, min: 0 },
      validated: { type: Boolean, default: false },
      validatedBy: String,
      validationDate: Date,
      comments: String,
    },
    photos: [String],
    gpsTrack: {
      coordinates: [[Number]], // Array of [longitude, latitude]
      timestamps: [Date],
    },
    carbonCalculation: {
      carbonStored: { type: Number, required: true, min: 0 },
      carbonEmitted: { type: Number, min: 0, default: 0 },
      netCarbon: { type: Number, required: true },
      calculationMethod: { type: String, required: true },
      calculatedBy: { type: String, required: true },
      calculatedDate: { type: Date, required: true },
      verified: { type: Boolean, default: false },
    },
    sync: {
      deviceId: String,
      localId: String,
      syncedAt: { type: Date, default: Date.now },
      uploadedFrom: {
        type: String,
        enum: ["mobile_app", "web_portal", "api", "sensor_network"],
        default: "mobile_app",
      },
    },
    measurementDate: {
      type: Date,
      required: true,
    },
    createdDate: {
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

// Indexes
FieldMeasurementSchema.index({ measurementId: 1 });
FieldMeasurementSchema.index({ farmer: 1, project: 1 });
FieldMeasurementSchema.index({ measurementType: 1, measurementDate: 1 });
FieldMeasurementSchema.index({ "location.coordinates": "2dsphere" });
FieldMeasurementSchema.index({ measurementDate: -1 });
FieldMeasurementSchema.index({ "sync.deviceId": 1 });

// Pre-save middleware
FieldMeasurementSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for age of measurement
FieldMeasurementSchema.virtual("ageInDays").get(function () {
  const now = new Date();
  const measured = new Date(this.measurementDate);
  return Math.floor(
    (now.getTime() - measured.getTime()) / (1000 * 60 * 60 * 24),
  );
});

export const FieldMeasurement = mongoose.model<IFieldMeasurement>(
  "FieldMeasurement",
  FieldMeasurementSchema,
);
