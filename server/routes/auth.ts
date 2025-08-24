import { RequestHandler } from "express";
import { AuthUser, Farmer, Admin, LoginResponse } from "@shared/auth";

// Mock data storage - in production, use a proper database
let farmers: Farmer[] = [];
let admins: Admin[] = [
  {
    id: "admin-1",
    email: "developerrdeepak@gmail.com",
    name: "Admin",
    role: "admin",
    createdAt: new Date(),
  }
];

// OTP storage - in production, use Redis or similar
let otpStorage: Record<string, { otp: string; expires: number }> = {};

// Mock session storage - in production, use proper session management
let sessions: Record<string, AuthUser> = {};

// Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate simple token - in production, use JWT
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Send OTP email (mock implementation)
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // In production, integrate with email service like SendGrid, SES, etc.
  console.log(`\n🔐 [OTP GENERATED] for ${email}: ${otp}`);
  console.log(`⏰ Valid for 5 minutes\n`);
  return true;
}

export const sendOTP: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStorage[email] = { otp, expires };

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (emailSent) {
      res.json({ success: true, message: "OTP sent successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const storedOTP = otpStorage[email];

    console.log(`🔍 [OTP VERIFICATION] for ${email}:`);
    console.log(`   Provided OTP: ${otp}`);
    console.log(`   Stored OTP: ${storedOTP?.otp || 'Not found'}`);
    console.log(`   Current time: ${Date.now()}`);
    console.log(`   Expires at: ${storedOTP?.expires || 'N/A'}`);

    if (!storedOTP) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (Date.now() > storedOTP.expires) {
      delete otpStorage[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP verified, create or find farmer
    let farmer = farmers.find(f => f.email === email);
    
    if (!farmer) {
      farmer = {
        id: `farmer-${Date.now()}`,
        email,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      farmers.push(farmer);
    }

    // Create session
    const token = generateToken();
    const user: AuthUser = {
      type: 'farmer',
      farmer
    };
    
    sessions[token] = user;

    // Clean up OTP
    delete otpStorage[email];

    const response: LoginResponse = {
      success: true,
      user,
      token,
    };

    res.json(response);
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check credentials
    if (email === "developerrdeepak@gmail.com" && password === "IITdelhi2023@") {
      const admin = admins.find(a => a.email === email);
      
      if (!admin) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Create session
      const token = generateToken();
      const user: AuthUser = {
        type: 'admin',
        admin
      };
      
      sessions[token] = user;

      const response: LoginResponse = {
        success: true,
        user,
        token,
      };

      res.json(response);
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyToken: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = sessions[token];

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = sessions[token];

    if (!user || user.type !== 'farmer') {
      return res.status(401).json({ success: false, message: "Invalid token or user type" });
    }

    const updates = req.body;
    const farmerIndex = farmers.findIndex(f => f.id === user.farmer?.id);

    if (farmerIndex === -1) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    // Update farmer data
    farmers[farmerIndex] = {
      ...farmers[farmerIndex],
      ...updates,
      updatedAt: new Date(),
    };

    // Update session
    const updatedUser: AuthUser = {
      type: 'farmer',
      farmer: farmers[farmerIndex]
    };
    
    sessions[token] = updatedUser;

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token && sessions[token]) {
      delete sessions[token];
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all farmers (admin only)
export const getFarmers: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = sessions[token];

    if (!user || user.type !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    res.json({ success: true, farmers });
  } catch (error) {
    console.error("Get farmers error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update farmer status (admin only)
export const updateFarmerStatus: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = sessions[token];

    if (!user || user.type !== 'admin') {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const { farmerId, status } = req.body;
    const farmerIndex = farmers.findIndex(f => f.id === farmerId);

    if (farmerIndex === -1) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    farmers[farmerIndex].verified = status === 'verified';
    farmers[farmerIndex].updatedAt = new Date();

    res.json({ success: true, farmer: farmers[farmerIndex] });
  } catch (error) {
    console.error("Update farmer status error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
