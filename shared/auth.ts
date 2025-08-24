export interface Farmer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  aadhaarId?: string;
  farmerId?: string;

  // Farm Details
  farmName?: string;
  landSize?: number;
  landUnit?: "acres" | "hectares";
  farmingType?: "organic" | "conventional" | "mixed";
  primaryCrops?: string[];
  irrigationType?: "rain_fed" | "canal" | "borewell" | "drip" | "sprinkler";

  // Location Details
  location?: {
    latitude?: number;
    longitude?: number;
    address: string;
    pincode: string;
    state: string;
    district?: string;
  };

  // Documents
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;

  // Carbon Projects
  interestedProjects?: string[];
  sustainablePractices?: string[];
  estimatedIncome?: number;

  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  createdAt: Date;
}

export interface FarmData {
  id: string;
  farmerId: string;
  soilPh?: number;
  soilMoisture?: number;
  cropType?: string;
  irrigationType?: string;
  waterUsage?: number;
  areaPlanted?: number;
  plantingDate?: Date;
  harvestDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarbonProject {
  id: string;
  name: string;
  type: "agroforestry" | "rice_based" | "soil_carbon" | "biomass";
  description: string;
  creditRate: number; // per hectare
  requirements: string[];
  status: "active" | "inactive" | "completed";
  participants: string[]; // farmer IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface CarbonCredit {
  id: string;
  farmerId: string;
  projectId: string;
  credits: number;
  income: number;
  status: "pending" | "verified" | "rejected" | "paid";
  calculatedAt: Date;
  verifiedAt?: Date;
  paymentDate?: Date;
}

export type UserType = "farmer" | "admin";

export interface AuthUser {
  type: UserType;
  farmer?: Farmer;
  admin?: Admin;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
  registrationData?: EnhancedFarmerRegistration;
}

export interface EnhancedFarmerRegistration {
  // Personal Info
  name: string;
  phone: string;

  // Farm Details
  farmName: string;
  landSize: number;
  landUnit: "acres" | "hectares";
  farmingType: "organic" | "conventional" | "mixed";
  primaryCrops: string[];
  irrigationType: "rain_fed" | "canal" | "borewell" | "drip" | "sprinkler";

  // Location
  address: string;
  pincode: string;
  state: string;
  district?: string;
  latitude?: number;
  longitude?: number;

  // Optional Documents
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;

  // Carbon Projects
  interestedProjects: string[];
  sustainablePractices: string[];
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}
