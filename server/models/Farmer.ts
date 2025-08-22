import mongoose, { Schema, Document } from "mongoose";

export interface IFarmer extends Document {
  _id: string;
  farmerId: string;
  name: string;
  email?: string;
  phone: string;
  aadhaarNumber?: string;
  address: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  farmDetails: {
    totalLandArea: number; // in acres
    irrigatedArea: number;
    drylandArea: number;
    landRecordNumber?: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  upiId?: string;
  profileImage?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  isActive: boolean;
  registrationDate: Date;
  lastLogin?: Date;
  totalCarbonCredits: number;
  totalEarnings: number;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    farmerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    aadhaarNumber: {
      type: String,
      sparse: true,
      index: true,
    },
    address: {
      village: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    farmDetails: {
      totalLandArea: { type: Number, required: true, min: 0 },
      irrigatedArea: { type: Number, required: true, min: 0 },
      drylandArea: { type: Number, required: true, min: 0 },
      landRecordNumber: String,
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String,
    },
    upiId: String,
    profileImage: String,
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    totalCarbonCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for farmer's fields
FarmerSchema.virtual("fields", {
  ref: "Field",
  localField: "_id",
  foreignField: "farmerId",
});

// Index for geospatial queries
FarmerSchema.index({ "address.district": 1, "address.state": 1 });

export default mongoose.model<IFarmer>("Farmer", FarmerSchema);
