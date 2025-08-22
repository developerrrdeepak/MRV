import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Farmer, { IFarmer } from '../models/Farmer';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate unique farmer ID
const generateFarmerId = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Find the last farmer registered today
  const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  
  const lastFarmer = await Farmer.findOne({
    registrationDate: { $gte: todayStart, $lt: todayEnd }
  }).sort({ farmerId: -1 });
  
  let sequence = 1;
  if (lastFarmer) {
    const lastSequence = parseInt(lastFarmer.farmerId.slice(-4));
    sequence = lastSequence + 1;
  }
  
  return `MRV${year}${month}${sequence.toString().padStart(4, '0')}`;
};

// Register new farmer
router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      aadhaarNumber,
      address,
      farmDetails,
      bankDetails,
      upiId,
      password
    } = req.body;

    // Validate required fields
    if (!name || !phone || !address || !farmDetails || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, address, farm details, and password are required'
      });
    }

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : []),
        ...(aadhaarNumber ? [{ aadhaarNumber }] : [])
      ]
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer already registered with this phone/email/Aadhaar'
      });
    }

    // Validate farm details
    if (farmDetails.totalLandArea < 0.1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum land area should be 0.1 acres'
      });
    }

    if (farmDetails.irrigatedArea + farmDetails.drylandArea !== farmDetails.totalLandArea) {
      return res.status(400).json({
        success: false,
        message: 'Irrigated + dryland area should equal total land area'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique farmer ID
    const farmerId = await generateFarmerId();

    // Create farmer
    const farmer = new Farmer({
      farmerId,
      name: name.trim(),
      email: email?.toLowerCase().trim(),
      phone: phone.trim(),
      aadhaarNumber: aadhaarNumber?.trim(),
      address: {
        village: address.village.trim(),
        district: address.district.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim()
      },
      farmDetails: {
        totalLandArea: parseFloat(farmDetails.totalLandArea),
        irrigatedArea: parseFloat(farmDetails.irrigatedArea),
        drylandArea: parseFloat(farmDetails.drylandArea),
        landRecordNumber: farmDetails.landRecordNumber?.trim()
      },
      bankDetails,
      upiId: upiId?.trim(),
      password: hashedPassword,
      verificationStatus: 'pending',
      isActive: true,
      registrationDate: new Date(),
      totalCarbonCredits: 0,
      totalEarnings: 0
    });

    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        farmerId: farmer._id, 
        phone: farmer.phone,
        role: 'farmer' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: {
        farmer: farmerResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login farmer
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

    // Find farmer by phone
    const farmer = await Farmer.findOne({ phone }).select('+password');

    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    // Check if farmer is active
    if (!farmer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, farmer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    // Update last login
    farmer.lastLogin = new Date();
    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        farmerId: farmer._id, 
        phone: farmer.phone,
        role: 'farmer' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        farmer: farmerResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current farmer profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const farmer = await Farmer.findById(req.user.farmerId)
      .populate('fields')
      .select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: { farmer }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update farmer profile
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, email, address, bankDetails, upiId } = req.body;

    const farmer = await Farmer.findById(req.user.farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Update allowed fields
    if (name) farmer.name = name.trim();
    if (email) farmer.email = email.toLowerCase().trim();
    if (address) {
      farmer.address = {
        village: address.village?.trim() || farmer.address.village,
        district: address.district?.trim() || farmer.address.district,
        state: address.state?.trim() || farmer.address.state,
        pincode: address.pincode?.trim() || farmer.address.pincode
      };
    }
    if (bankDetails) farmer.bankDetails = bankDetails;
    if (upiId) farmer.upiId = upiId.trim();

    await farmer.save();

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { farmer: farmerResponse }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const farmer = await Farmer.findById(req.user.farmerId).select('+password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, farmer.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    farmer.password = hashedNewPassword;
    await farmer.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
