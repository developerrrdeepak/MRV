import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        farmerId: string;
        phone: string;
        role: string;
      };
    }
  }
}

export interface JwtPayload {
  farmerId: string;
  phone: string;
  role: string;
  iat: number;
  exp: number;
}

// Authenticate JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
      (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
          });
        }

        req.user = decoded as JwtPayload;
        next();
      },
    );
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Check if user is a farmer
export const requireFarmer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "farmer") {
    return res.status(403).json({
      success: false,
      message: "Farmer access required",
    });
  }

  next();
};

// Check if user is an admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// Check if user is a verifier
export const requireVerifier = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!["verifier", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Verifier access required",
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next(); // No token, continue without user
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
      (err, decoded) => {
        if (!err && decoded) {
          req.user = decoded as JwtPayload;
        }
        next(); // Continue regardless of token validity
      },
    );
  } catch (error) {
    console.error("Optional auth error:", error);
    next(); // Continue even if error
  }
};
