import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  paymentId: string;
  farmerId: mongoose.Types.ObjectId;
  creditIds: mongoose.Types.ObjectId[];
  
  // Payment details
  paymentDetails: {
    amount: number; // INR
    currency: string;
    description: string;
    paymentType: 'carbon-credit-sale' | 'bonus' | 'incentive' | 'refund' | 'penalty';
    paymentMethod: 'upi' | 'bank-transfer' | 'digital-wallet' | 'check';
  };
  
  // Transaction information
  transaction: {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    transactionId?: string;
    gatewayTransactionId?: string;
    gateway: 'razorpay' | 'paytm' | 'upi' | 'bank' | 'manual';
    processingFee: number; // INR
    gst: number; // INR
    netAmount: number; // INR
  };
  
  // Recipient details
  recipient: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountHolderName?: string;
    upiId?: string;
    digitalWalletId?: string;
  };
  
  // Timeline
  dates: {
    initiatedDate: Date;
    processedDate?: Date;
    completedDate?: Date;
    failedDate?: Date;
    refundDate?: Date;
  };
  
  // Additional information
  metadata: {
    creditsPeriod?: {
      startDate: Date;
      endDate: Date;
    };
    creditsQuantity?: number;
    pricePerCredit?: number;
    bonusReason?: string;
    penaltyReason?: string;
  };
  
  // Verification and audit
  verification: {
    verifiedBy?: mongoose.Types.ObjectId;
    verificationDate?: Date;
    verificationNotes?: string;
    requiresApproval: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    approvalDate?: Date;
  };
  
  // System tracking
  retryAttempts: number;
  lastRetryDate?: Date;
  errorMessages?: string[];
  isActive: boolean;
  notes?: string;
}

const PaymentSchema = new Schema<IPayment>({
  paymentId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  farmerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Farmer', 
    required: true,
    index: true 
  },
  creditIds: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'CarbonCredit' 
  }],
  
  paymentDetails: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    description: { type: String, required: true },
    paymentType: { 
      type: String, 
      required: true,
      enum: ['carbon-credit-sale', 'bonus', 'incentive', 'refund', 'penalty'] 
    },
    paymentMethod: { 
      type: String, 
      required: true,
      enum: ['upi', 'bank-transfer', 'digital-wallet', 'check'] 
    }
  },
  
  transaction: {
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'], 
      default: 'pending',
      index: true 
    },
    transactionId: String,
    gatewayTransactionId: String,
    gateway: { 
      type: String, 
      enum: ['razorpay', 'paytm', 'upi', 'bank', 'manual'],
      required: true 
    },
    processingFee: { type: Number, min: 0, default: 0 },
    gst: { type: Number, min: 0, default: 0 },
    netAmount: { type: Number, required: true, min: 0 }
  },
  
  recipient: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
    upiId: String,
    digitalWalletId: String
  },
  
  dates: {
    initiatedDate: { type: Date, default: Date.now, required: true },
    processedDate: Date,
    completedDate: Date,
    failedDate: Date,
    refundDate: Date
  },
  
  metadata: {
    creditsPeriod: {
      startDate: Date,
      endDate: Date
    },
    creditsQuantity: { type: Number, min: 0 },
    pricePerCredit: { type: Number, min: 0 },
    bonusReason: String,
    penaltyReason: String
  },
  
  verification: {
    verifiedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    verificationDate: Date,
    verificationNotes: String,
    requiresApproval: { type: Boolean, default: false },
    approvedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    approvalDate: Date
  },
  
  retryAttempts: { type: Number, default: 0, min: 0 },
  lastRetryDate: Date,
  errorMessages: [String],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
PaymentSchema.index({ farmerId: 1, 'transaction.status': 1 });
PaymentSchema.index({ 'dates.initiatedDate': -1 });
PaymentSchema.index({ 'paymentDetails.paymentType': 1, 'transaction.status': 1 });
PaymentSchema.index({ 'transaction.gateway': 1, 'dates.initiatedDate': -1 });

// Virtual for payment summary
PaymentSchema.virtual('summary').get(function() {
  return {
    amount: this.paymentDetails.amount,
    status: this.transaction.status,
    method: this.paymentDetails.paymentMethod,
    date: this.dates.completedDate || this.dates.initiatedDate
  };
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
