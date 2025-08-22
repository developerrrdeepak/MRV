import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  _id: string;
  verificationId: string;
  project: mongoose.Types.ObjectId; // Reference to CarbonProject
  verificationPeriod: {
    startDate: Date;
    endDate: Date;
    reportingPeriod: string; // e.g., "Year 1", "Q1 2024"
  };
  verifier: {
    organizationName: string;
    verifierName: string;
    accreditation: string; // VVB accreditation number
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
  };
  standard: {
    name: string; // VCS, CDM, Gold Standard, etc.
    version: string;
    methodology: string;
    requirements: string[];
  };
  scope: {
    description: string;
    sites: string[]; // List of sites/villages verified
    farmers: mongoose.Types.ObjectId[]; // Farmers included in verification
    measurements: mongoose.Types.ObjectId[]; // Field measurements verified
    activities: string[]; // Activities verified
  };
  findings: {
    carbonReductions: {
      claimed: number; // tCO2e claimed by project
      verified: number; // tCO2e verified
      difference: number; // verified - claimed
      adjustmentReason?: string;
    };
    compliance: {
      methodologyCompliance: 'compliant' | 'non_compliant' | 'conditional';
      dataQuality: 'excellent' | 'good' | 'adequate' | 'poor';
      documentationQuality: 'excellent' | 'good' | 'adequate' | 'poor';
      overallRating: 'approved' | 'approved_with_conditions' | 'rejected';
    };
    issues: [{
      category: 'methodology' | 'data_quality' | 'documentation' | 'implementation' | 'monitoring' | 'other';
      severity: 'critical' | 'major' | 'minor';
      description: string;
      correctionRequired: boolean;
      deadline?: Date;
      resolved: boolean;
      resolution?: string;
    }];
    recommendations: string[];
  };
  sampling: {
    method: string; // Random, stratified, purposive, etc.
    sampleSize: number; // Number of farmers/plots sampled
    totalPopulation: number; // Total farmers/plots in project
    samplingRatio: number; // Sample size / total population
    confidenceLevel: number; // 90%, 95%, 99%
    marginOfError: number; // Percentage
    sites: [{
      siteId: string;
      farmer: mongoose.Types.ObjectId;
      plotId: string;
      selected: boolean;
      reason?: string; // Why this site was selected
      visitDate?: Date;
      findings?: string;
    }];
  };
  documentation: {
    verificationPlan: string; // File path/URL
    fieldWorkReports: string[];
    dataAnalysisReports: string[];
    verificationReport: string; // Final verification report
    verificationStatement: string; // Verification statement
    correctionReports?: string[];
    photos: string[];
    gpsData?: string[]; // GPS tracks from field visits
  };
  timeline: {
    contractDate: Date;
    fieldWorkStartDate: Date;
    fieldWorkEndDate: Date;
    draftReportDate?: Date;
    finalReportDate?: Date;
    certificationDate?: Date;
    validityPeriod?: {
      startDate: Date;
      endDate: Date;
    };
  };
  costs: {
    verificationFee: number;
    travelCosts?: number;
    miscellaneousCosts?: number;
    totalCost: number;
    currency: string;
    paymentStatus: 'pending' | 'partial' | 'paid';
  };
  carbonCredits: {
    eligibleCredits: number; // tCO2e eligible for issuance
    issuedCredits?: number; // tCO2e actually issued
    serialNumbers?: string[]; // VCU/CER serial numbers
    registryDetails?: {
      registryName: string;
      registryId: string;
      issuanceDate?: Date;
    };
  };
  stakeholders: {
    projectDeveloper: string;
    projectOwner: string;
    localCommunity?: string;
    government?: string;
    ngo?: string;
  };
  publicConsultation?: {
    required: boolean;
    conducted: boolean;
    startDate?: Date;
    endDate?: Date;
    comments: [{
      stakeholder: string;
      comment: string;
      response?: string;
      date: Date;
    }];
  };
  status: 'planned' | 'ongoing' | 'under_review' | 'completed' | 'certified' | 'rejected';
  createdDate: Date;
  lastUpdated: Date;
}

const VerificationSchema = new Schema<IVerification>({
  verificationId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'CarbonProject',
    required: true
  },
  verificationPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reportingPeriod: { type: String, required: true }
  },
  verifier: {
    organizationName: { type: String, required: true },
    verifierName: { type: String, required: true },
    accreditation: { type: String, required: true },
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    }
  },
  standard: {
    name: { type: String, required: true },
    version: { type: String, required: true },
    methodology: { type: String, required: true },
    requirements: [String]
  },
  scope: {
    description: { type: String, required: true },
    sites: [String],
    farmers: [{
      type: Schema.Types.ObjectId,
      ref: 'Farmer'
    }],
    measurements: [{
      type: Schema.Types.ObjectId,
      ref: 'FieldMeasurement'
    }],
    activities: [String]
  },
  findings: {
    carbonReductions: {
      claimed: { type: Number, required: true, min: 0 },
      verified: { type: Number, required: true, min: 0 },
      difference: { type: Number, required: true },
      adjustmentReason: String
    },
    compliance: {
      methodologyCompliance: {
        type: String,
        required: true,
        enum: ['compliant', 'non_compliant', 'conditional']
      },
      dataQuality: {
        type: String,
        required: true,
        enum: ['excellent', 'good', 'adequate', 'poor']
      },
      documentationQuality: {
        type: String,
        required: true,
        enum: ['excellent', 'good', 'adequate', 'poor']
      },
      overallRating: {
        type: String,
        required: true,
        enum: ['approved', 'approved_with_conditions', 'rejected']
      }
    },
    issues: [{
      category: {
        type: String,
        required: true,
        enum: ['methodology', 'data_quality', 'documentation', 'implementation', 'monitoring', 'other']
      },
      severity: {
        type: String,
        required: true,
        enum: ['critical', 'major', 'minor']
      },
      description: { type: String, required: true },
      correctionRequired: { type: Boolean, required: true },
      deadline: Date,
      resolved: { type: Boolean, default: false },
      resolution: String
    }],
    recommendations: [String]
  },
  sampling: {
    method: { type: String, required: true },
    sampleSize: { type: Number, required: true, min: 1 },
    totalPopulation: { type: Number, required: true, min: 1 },
    samplingRatio: { type: Number, required: true, min: 0, max: 1 },
    confidenceLevel: { type: Number, required: true, min: 0, max: 100 },
    marginOfError: { type: Number, required: true, min: 0, max: 50 },
    sites: [{
      siteId: { type: String, required: true },
      farmer: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
      },
      plotId: { type: String, required: true },
      selected: { type: Boolean, required: true },
      reason: String,
      visitDate: Date,
      findings: String
    }]
  },
  documentation: {
    verificationPlan: String,
    fieldWorkReports: [String],
    dataAnalysisReports: [String],
    verificationReport: String,
    verificationStatement: String,
    correctionReports: [String],
    photos: [String],
    gpsData: [String]
  },
  timeline: {
    contractDate: { type: Date, required: true },
    fieldWorkStartDate: { type: Date, required: true },
    fieldWorkEndDate: { type: Date, required: true },
    draftReportDate: Date,
    finalReportDate: Date,
    certificationDate: Date,
    validityPeriod: {
      startDate: Date,
      endDate: Date
    }
  },
  costs: {
    verificationFee: { type: Number, required: true, min: 0 },
    travelCosts: { type: Number, min: 0 },
    miscellaneousCosts: { type: Number, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'INR' },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending'
    }
  },
  carbonCredits: {
    eligibleCredits: { type: Number, required: true, min: 0 },
    issuedCredits: { type: Number, min: 0 },
    serialNumbers: [String],
    registryDetails: {
      registryName: String,
      registryId: String,
      issuanceDate: Date
    }
  },
  stakeholders: {
    projectDeveloper: { type: String, required: true },
    projectOwner: { type: String, required: true },
    localCommunity: String,
    government: String,
    ngo: String
  },
  publicConsultation: {
    required: { type: Boolean, default: false },
    conducted: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    comments: [{
      stakeholder: { type: String, required: true },
      comment: { type: String, required: true },
      response: String,
      date: { type: Date, required: true }
    }]
  },
  status: {
    type: String,
    required: true,
    enum: ['planned', 'ongoing', 'under_review', 'completed', 'certified', 'rejected'],
    default: 'planned'
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
VerificationSchema.index({ verificationId: 1 });
VerificationSchema.index({ project: 1, status: 1 });
VerificationSchema.index({ 'verificationPeriod.startDate': 1, 'verificationPeriod.endDate': 1 });
VerificationSchema.index({ 'verifier.organizationName': 1 });
VerificationSchema.index({ 'timeline.contractDate': -1 });

// Pre-save middleware
VerificationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  // Calculate sampling ratio
  if (this.sampling.sampleSize && this.sampling.totalPopulation) {
    this.sampling.samplingRatio = this.sampling.sampleSize / this.sampling.totalPopulation;
  }
  // Calculate difference in carbon reductions
  if (this.findings.carbonReductions.claimed && this.findings.carbonReductions.verified) {
    this.findings.carbonReductions.difference = 
      this.findings.carbonReductions.verified - this.findings.carbonReductions.claimed;
  }
  next();
});

// Virtual for verification duration
VerificationSchema.virtual('verificationDuration').get(function() {
  const start = new Date(this.timeline.fieldWorkStartDate);
  const end = new Date(this.timeline.fieldWorkEndDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); // in days
});

// Virtual for cost per credit
VerificationSchema.virtual('costPerCredit').get(function() {
  return this.carbonCredits.eligibleCredits > 0 ? 
    this.costs.totalCost / this.carbonCredits.eligibleCredits : 0;
});

export const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
