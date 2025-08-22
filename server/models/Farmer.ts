import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmer extends Document {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  farmerId: string; // Unique farmer identification
  location: {
    state: string;
    district: string;
    village: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails: {
    totalArea: number; // in hectares
    croppingPattern: string[];
    soilType: string;
    irrigationType: string;
  };
  profile: {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    education?: string;
    experience?: number; // years in farming
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  documents?: {
    aadharNumber?: string;
    landRecords?: string[];
    photos?: string[];
  };
  carbonProjects: mongoose.Types.ObjectId[]; // Reference to CarbonProject
  isActive: boolean;
  registrationDate: Date;
  lastUpdated: Date;
}

const FarmerSchema = new Schema<IFarmer>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[6-9]\d{9}$/.test(v); // Indian mobile number format
      },
      message: 'Please enter a valid Indian mobile number'
    }
  },
  email: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  farmerId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    }
  },
  farmDetails: {
    totalArea: { type: Number, required: true, min: 0 },
    croppingPattern: [{ type: String }],
    soilType: { 
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Mountain', 'Desert', 'Sandy', 'Clay', 'Loamy']
    },
    irrigationType: {
      type: String,
      enum: ['Rainfed', 'Irrigated', 'Drip', 'Sprinkler', 'Flood', 'Mixed']
    }
  },
  profile: {
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    education: String,
    experience: { type: Number, min: 0 }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  documents: {
    aadharNumber: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^\d{12}$/.test(v);
        },
        message: 'Aadhar number must be 12 digits'
      }
    },
    landRecords: [String],
    photos: [String]
  },
  carbonProjects: [{
    type: Schema.Types.ObjectId,
    ref: 'CarbonProject'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
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

// Indexes for better performance
FarmerSchema.index({ farmerId: 1 });
FarmerSchema.index({ phone: 1 });
FarmerSchema.index({ 'location.state': 1, 'location.district': 1 });
FarmerSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries

// Pre-save middleware to update lastUpdated
FarmerSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Virtual for farmer's full location
FarmerSchema.virtual('fullLocation').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state}`;
});

export const Farmer = mongoose.model<IFarmer>('Farmer', FarmerSchema);
