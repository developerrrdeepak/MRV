import mongoose, { Schema, Document } from 'mongoose';

export interface ICarbonProject extends Document {
  _id: string;
  projectId: string; // Unique project identifier
  name: string;
  description: string;
  projectType: 'agroforestry' | 'rice_cultivation' | 'soil_carbon' | 'biomass' | 'renewable_energy' | 'other';
  methodology: string; // CDM, VCS, Gold Standard, etc.
  status: 'planning' | 'implementation' | 'monitoring' | 'verification' | 'completed' | 'cancelled';
  location: {
    state: string;
    district: string;
    villages: string[];
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    geoPolygon?: {
      type: 'Polygon';
      coordinates: number[][][]; // GeoJSON polygon
    };
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    monitoringPeriod: number; // in months
    credittingPeriod: number; // in years
  };
  carbonMetrics: {
    baselineEmissions: number; // tCO2e
    projectedReductions: number; // tCO2e
    actualReductions?: number; // tCO2e (updated during monitoring)
    creditsIssued?: number; // Carbon credits issued
    creditsTraded?: number; // Carbon credits sold
  };
  participants: {
    farmers: mongoose.Types.ObjectId[]; // Reference to Farmer
    coordinator: string; // Project coordinator name
    verifier?: string; // Third-party verifier
    buyer?: string; // Carbon credit buyer
  };
  activities: [{
    activityType: string; // Tree planting, organic farming, etc.
    description: string;
    targetArea: number; // in hectares
    completedArea?: number; // in hectares
    timeline: {
      startDate: Date;
      endDate?: Date;
    };
  }];
  monitoring: {
    frequency: 'monthly' | 'quarterly' | 'annual';
    parameters: string[]; // What to monitor
    lastMonitoring?: Date;
    nextMonitoring?: Date;
  };
  verification: {
    standard: string; // VCS, CDM, Gold Standard, etc.
    frequency: 'annual' | 'biannual';
    lastVerification?: Date;
    nextVerification?: Date;
    verificationReports: string[]; // File paths/URLs
  };
  financials: {
    totalBudget: number;
    spentAmount?: number;
    carbonPrice: number; // Price per tCO2e
    paymentSchedule: [{
      milestone: string;
      amount: number;
      dueDate: Date;
      paid: boolean;
    }];
  };
  documents: {
    projectDocument: string; // PDD file path
    monitoringReports: string[];
    verificationReports: string[];
    certificates: string[];
  };
  isActive: boolean;
  createdDate: Date;
  lastUpdated: Date;
}

const CarbonProjectSchema = new Schema<ICarbonProject>({
  projectId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  projectType: {
    type: String,
    required: true,
    enum: ['agroforestry', 'rice_cultivation', 'soil_carbon', 'biomass', 'renewable_energy', 'other']
  },
  methodology: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'implementation', 'monitoring', 'verification', 'completed', 'cancelled'],
    default: 'planning'
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    villages: [{ type: String }],
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    },
    geoPolygon: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
      },
      coordinates: {
        type: [[[Number]]]
      }
    }
  },
  timeline: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    monitoringPeriod: { type: Number, required: true, min: 1 },
    credittingPeriod: { type: Number, required: true, min: 1 }
  },
  carbonMetrics: {
    baselineEmissions: { type: Number, required: true, min: 0 },
    projectedReductions: { type: Number, required: true, min: 0 },
    actualReductions: { type: Number, min: 0 },
    creditsIssued: { type: Number, min: 0, default: 0 },
    creditsTraded: { type: Number, min: 0, default: 0 }
  },
  participants: {
    farmers: [{
      type: Schema.Types.ObjectId,
      ref: 'Farmer'
    }],
    coordinator: { type: String, required: true },
    verifier: String,
    buyer: String
  },
  activities: [{
    activityType: { type: String, required: true },
    description: { type: String, required: true },
    targetArea: { type: Number, required: true, min: 0 },
    completedArea: { type: Number, min: 0 },
    timeline: {
      startDate: { type: Date, required: true },
      endDate: Date
    }
  }],
  monitoring: {
    frequency: {
      type: String,
      required: true,
      enum: ['monthly', 'quarterly', 'annual']
    },
    parameters: [{ type: String }],
    lastMonitoring: Date,
    nextMonitoring: Date
  },
  verification: {
    standard: { type: String, required: true },
    frequency: {
      type: String,
      required: true,
      enum: ['annual', 'biannual']
    },
    lastVerification: Date,
    nextVerification: Date,
    verificationReports: [String]
  },
  financials: {
    totalBudget: { type: Number, required: true, min: 0 },
    spentAmount: { type: Number, min: 0, default: 0 },
    carbonPrice: { type: Number, required: true, min: 0 },
    paymentSchedule: [{
      milestone: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      dueDate: { type: Date, required: true },
      paid: { type: Boolean, default: false }
    }]
  },
  documents: {
    projectDocument: String,
    monitoringReports: [String],
    verificationReports: [String],
    certificates: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CarbonProjectSchema.index({ projectId: 1 });
CarbonProjectSchema.index({ projectType: 1, status: 1 });
CarbonProjectSchema.index({ 'location.state': 1, 'location.district': 1 });
CarbonProjectSchema.index({ 'location.coordinates': '2dsphere' });
CarbonProjectSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 });

// Pre-save middleware
CarbonProjectSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for project duration
CarbonProjectSchema.virtual('duration').get(function() {
  const start = new Date(this.timeline.startDate);
  const end = new Date(this.timeline.endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)); // in years
});

// Virtual for carbon efficiency
CarbonProjectSchema.virtual('carbonEfficiency').get(function() {
  return this.carbonMetrics.projectedReductions / this.financials.totalBudget;
});

export const CarbonProject = mongoose.model<ICarbonProject>('CarbonProject', CarbonProjectSchema);
