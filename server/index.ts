import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthCheck } from "./routes/health";
import { testEmail, getEmailStatus } from "./routes/test";
import {
  sendOTP,
  verifyOTP,
  adminLogin,
  verifyToken,
  updateProfile,
  logout,
  getFarmers,
  updateFarmerStatus,
  farmerPasswordRegister,
  farmerPasswordLogin,
  socialAuth,
  socialCallback,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware (only in development)
  if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
      console.log(
        `📝 [${req.method}] ${req.path}`,
        req.body ? JSON.stringify(req.body).substring(0, 100) + "..." : "",
      );
      next();
    });
  }

  // System routes
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: process.env.PING_MESSAGE ?? "pong",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.get("/api/health", healthCheck);

  // Authentication routes
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);
  app.post("/api/auth/admin-login", adminLogin);
  app.post("/api/auth/farmer-register", farmerPasswordRegister);
  app.post("/api/auth/farmer-login", farmerPasswordLogin);
  app.get("/api/auth/verify", verifyToken);
  app.put("/api/auth/update-profile", updateProfile);
  app.post("/api/auth/logout", logout);

  // Social Authentication routes (temporarily disabled due to path-to-regexp issue)
  // app.post("/api/auth/social/:provider", socialAuth);
  // app.get("/api/auth/social/:provider/callback", socialCallback);

  // Estimator routes (no DB required)
  app.post("/api/estimator/calculate", (await import("./routes/estimator")).calculateEstimator);

  // Admin routes (protected)
  app.get("/api/admin/farmers", getFarmers);
  app.put("/api/admin/farmer-status", updateFarmerStatus);

  // Test routes (development only)
  if (process.env.NODE_ENV !== "production") {
    app.post("/api/test/email", testEmail);
    app.get("/api/test/email-status", getEmailStatus);
  }

  // Global error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("🚨 [SERVER ERROR]", {
        path: req.path,
        method: req.method,
        error: error.message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV !== "production" && {
          stack: error.stack,
          body: req.body,
        }),
      });

      res.status(500).json({
        success: false,
        message: "Internal server error",
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV !== "production" && {
          error: error.message,
          path: req.path,
        }),
      });
    },
  );

  // 404 handler for API routes
  app.use("/api", (req, res) => {
    console.log("❓ [404] API endpoint not found:", req.method, req.path);
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`,
      timestamp: new Date().toISOString(),
      availableEndpoints: [
        "GET /api/ping",
        "GET /api/health",
        "POST /api/auth/send-otp",
        "POST /api/auth/verify-otp",
        "POST /api/auth/admin-login",
        "POST /api/auth/farmer-register",
        "POST /api/auth/farmer-login",
        "GET /api/auth/verify",
        "PUT /api/auth/update-profile",
        "POST /api/auth/logout",
        "POST /api/auth/social/:provider",
        "GET /api/auth/social/:provider/callback",
        "GET /api/admin/farmers",
        "PUT /api/admin/farmer-status",
        ...(process.env.NODE_ENV !== "production"
          ? ["POST /api/test/email", "GET /api/test/email-status"]
          : []),
      ],
    });
  });

  return app;
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 [SHUTDOWN] SIGTERM received, shutting down gracefully...");
  try {
    const Database = await import("./lib/database");
    await Database.default.getInstance().disconnect();
    console.log("✅ [SHUTDOWN] Database disconnected successfully");
  } catch (error) {
    console.error("❌ [SHUTDOWN] Error during database disconnect:", error);
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 [SHUTDOWN] SIGINT received, shutting down gracefully...");
  try {
    const Database = await import("./lib/database");
    await Database.default.getInstance().disconnect();
    console.log("✅ [SHUTDOWN] Database disconnected successfully");
  } catch (error) {
    console.error("❌ [SHUTDOWN] Error during database disconnect:", error);
  }
  process.exit(0);
});
