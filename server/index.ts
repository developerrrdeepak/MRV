import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  sendOTP,
  verifyOTP,
  adminLogin,
  verifyToken,
  updateProfile,
  logout,
  getFarmers,
  updateFarmerStatus,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);
  app.post("/api/auth/admin-login", adminLogin);
  app.get("/api/auth/verify", verifyToken);
  app.put("/api/auth/update-profile", updateProfile);
  app.post("/api/auth/logout", logout);

  // Admin routes
  app.get("/api/admin/farmers", getFarmers);
  app.put("/api/admin/farmer-status", updateFarmerStatus);

  return app;
}
