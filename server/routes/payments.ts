import express, { Request, Response } from 'express';
import Payment from '../models/Payment';
import CarbonCredit from '../models/CarbonCredit';
import Farmer from '../models/Farmer';
import { authenticateToken, requireFarmer, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Generate unique payment ID
const generatePaymentId = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  const todayCount = await Payment.countDocuments({
    'dates.initiatedDate': {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  });
  
  const sequence = (todayCount + 1).toString().padStart(4, '0');
  return `PAY${year}${month}${day}${sequence}`;
};

// Create payment for carbon credits
router.post('/create', authenticateToken, requireFarmer, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user.farmerId;
    const { creditIds, paymentMethod = 'upi' } = req.body;

    // Validate required fields
    if (!creditIds || creditIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit IDs are required'
      });
    }

    // Verify farmer details
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Verify farmer has payment details
    if (paymentMethod === 'upi' && !farmer.upiId) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID not configured. Please update your profile.'
      });
    }

    if (paymentMethod === 'bank-transfer' && !farmer.bankDetails) {
      return res.status(400).json({
        success: false,
        message: 'Bank details not configured. Please update your profile.'
      });
    }

    // Verify credits
    const credits = await CarbonCredit.find({
      _id: { $in: creditIds },
      farmerId,
      'verification.status': 'verified',
      'market.status': 'listed',
      'payment.paymentStatus': 'pending',
      isActive: true
    });

    if (credits.length !== creditIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some credits are not eligible for payment'
      });
    }

    // Calculate total payment
    const totalCredits = credits.reduce((sum, credit) => sum + credit.creditDetails.creditsIssued, 0);
    const totalValue = credits.reduce((sum, credit) => sum + credit.market.totalValue, 0);
    const totalEarnings = credits.reduce((sum, credit) => sum + credit.payment.netEarnings, 0);

    // Generate payment ID
    const paymentId = await generatePaymentId();

    // Determine recipient details
    const recipient: any = {};
    if (paymentMethod === 'upi') {
      recipient.upiId = farmer.upiId;
    } else if (paymentMethod === 'bank-transfer' && farmer.bankDetails) {
      recipient.accountNumber = farmer.bankDetails.accountNumber;
      recipient.ifscCode = farmer.bankDetails.ifscCode;
      recipient.bankName = farmer.bankDetails.bankName;
      recipient.accountHolderName = farmer.bankDetails.accountHolderName;
    }

    // Calculate fees
    const processingFee = totalEarnings * 0.01; // 1% processing fee
    const gst = processingFee * 0.18; // 18% GST on processing fee
    const netAmount = totalEarnings - processingFee - gst;

    // Create payment record
    const payment = new Payment({
      paymentId,
      farmerId,
      creditIds,
      paymentDetails: {
        amount: totalEarnings,
        currency: 'INR',
        description: `Payment for ${totalCredits} carbon credits`,
        paymentType: 'carbon-credit-sale',
        paymentMethod
      },
      transaction: {
        status: 'pending',
        gateway: paymentMethod === 'upi' ? 'upi' : 'bank',
        processingFee,
        gst,
        netAmount
      },
      recipient,
      dates: {
        initiatedDate: new Date()
      },
      metadata: {
        creditsQuantity: totalCredits,
        pricePerCredit: totalValue / totalCredits,
        creditsPeriod: {
          startDate: new Date(Math.min(...credits.map(c => c.calculationPeriod.startDate.getTime()))),
          endDate: new Date(Math.max(...credits.map(c => c.calculationPeriod.endDate.getTime())))
        }
      },
      verification: {
        requiresApproval: totalEarnings > 50000, // Require approval for payments > 50K
        verificationNotes: `Payment for ${credits.length} verified carbon credits`
      },
      retryAttempts: 0,
      isActive: true
    });

    await payment.save();

    // Update credit payment status
    await CarbonCredit.updateMany(
      { _id: { $in: creditIds } },
      { 
        'payment.paymentStatus': 'processing',
        'market.status': 'sold',
        'market.soldDate': new Date()
      }
    );

    // Populate credit information for response
    await payment.populate('creditIds', 'creditId creditDetails.creditsIssued market.totalValue');

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: { payment }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get farmer's payment history
router.get('/', authenticateToken, requireFarmer, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user.farmerId;
    const { 
      page = 1, 
      limit = 20, 
      status, 
      paymentType,
      startDate,
      endDate 
    } = req.query;

    // Build query
    const query: any = { farmerId, isActive: true };
    if (status) query['transaction.status'] = status;
    if (paymentType) query['paymentDetails.paymentType'] = paymentType;
    
    if (startDate || endDate) {
      query['dates.initiatedDate'] = {};
      if (startDate) query['dates.initiatedDate'].$gte = new Date(startDate as string);
      if (endDate) query['dates.initiatedDate'].$lte = new Date(endDate as string);
    }

    const payments = await Payment.find(query)
      .populate('creditIds', 'creditId creditDetails.creditsIssued creditDetails.vintage')
      .sort({ 'dates.initiatedDate': -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Payment.countDocuments(query);

    // Calculate summary statistics
    const totalEarnings = await Payment.aggregate([
      {
        $match: {
          farmerId: farmer._id,
          'transaction.status': 'completed',
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$transaction.netAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          totalEarnings: totalEarnings[0]?.total || 0,
          totalPayments: totalEarnings[0]?.count || 0
        },
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });

  } catch (error) {
    console.error('Payments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific payment details
router.get('/:paymentId', authenticateToken, requireFarmer, async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const farmerId = req.user.farmerId;

    const payment = await Payment.findOne({
      _id: paymentId,
      farmerId,
      isActive: true
    }).populate('creditIds', 'creditId creditDetails fieldId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: { payment }
    });

  } catch (error) {
    console.error('Payment fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Retry failed payment
router.post('/:paymentId/retry', authenticateToken, requireFarmer, async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const farmerId = req.user.farmerId;

    const payment = await Payment.findOne({
      _id: paymentId,
      farmerId,
      isActive: true
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if payment can be retried
    if (payment.transaction.status !== 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Only failed payments can be retried'
      });
    }

    if (payment.retryAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum retry attempts exceeded'
      });
    }

    // Update payment status
    payment.transaction.status = 'pending';
    payment.retryAttempts += 1;
    payment.lastRetryDate = new Date();
    payment.errorMessages = []; // Clear previous error messages

    await payment.save();

    // Here you would integrate with actual payment gateway
    // For demo purposes, we'll simulate processing
    setTimeout(async () => {
      try {
        // Simulate payment processing
        const success = Math.random() > 0.3; // 70% success rate
        
        if (success) {
          payment.transaction.status = 'completed';
          payment.dates.processedDate = new Date();
          payment.dates.completedDate = new Date();
          payment.transaction.transactionId = `TXN${Date.now()}`;
          
          // Update farmer's total earnings
          await Farmer.findByIdAndUpdate(farmerId, {
            $inc: { totalEarnings: payment.transaction.netAmount }
          });
          
        } else {
          payment.transaction.status = 'failed';
          payment.dates.failedDate = new Date();
          payment.errorMessages = ['Payment gateway error: Transaction declined'];
        }
        
        await payment.save();
        
      } catch (error) {
        console.error('Payment processing error:', error);
      }
    }, 2000); // Simulate 2 second processing time

    res.json({
      success: true,
      message: 'Payment retry initiated successfully',
      data: { payment }
    });

  } catch (error) {
    console.error('Payment retry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retry payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: Get all payments
router.get('/admin/all', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      requiresApproval = false,
      farmerId 
    } = req.query;

    // Build query
    const query: any = { isActive: true };
    if (status) query['transaction.status'] = status;
    if (requiresApproval === 'true') query['verification.requiresApproval'] = true;
    if (farmerId) query.farmerId = farmerId;

    const payments = await Payment.find(query)
      .populate('farmerId', 'name phone farmerId')
      .populate('creditIds', 'creditId creditDetails.creditsIssued')
      .sort({ 'dates.initiatedDate': -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });

  } catch (error) {
    console.error('Admin payments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: Approve payment
router.patch('/:paymentId/approve', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { approved, notes } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      isActive: true
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (!payment.verification.requiresApproval) {
      return res.status(400).json({
        success: false,
        message: 'Payment does not require approval'
      });
    }

    // Update approval status
    payment.verification.approvedBy = req.user.farmerId;
    payment.verification.approvalDate = new Date();
    payment.verification.verificationNotes = notes;

    if (approved) {
      payment.transaction.status = 'processing';
      payment.dates.processedDate = new Date();
    } else {
      payment.transaction.status = 'cancelled';
      payment.errorMessages = ['Payment cancelled by admin'];
    }

    await payment.save();

    res.json({
      success: true,
      message: `Payment ${approved ? 'approved' : 'rejected'} successfully`,
      data: { payment }
    });

  } catch (error) {
    console.error('Payment approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment approval',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get payment statistics
router.get('/stats/summary', authenticateToken, requireFarmer, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user.farmerId;

    const stats = await Payment.aggregate([
      {
        $match: {
          farmerId: farmer._id,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$transaction.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$paymentDetails.amount' },
          totalNet: { $sum: '$transaction.netAmount' }
        }
      }
    ]);

    // Get monthly earnings for the last 12 months
    const monthlyEarnings = await Payment.aggregate([
      {
        $match: {
          farmerId: farmer._id,
          'transaction.status': 'completed',
          'dates.completedDate': {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$dates.completedDate' },
            month: { $month: '$dates.completedDate' }
          },
          earnings: { $sum: '$transaction.netAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusSummary: stats,
        monthlyEarnings
      }
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
