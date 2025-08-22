import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";

// Import route handlers
import farmerRoutes from "./routes/farmers";
import authRoutes from "./routes/auth";
import fieldRoutes from "./routes/fields";
import measurementRoutes from "./routes/measurements";
import carbonCreditRoutes from "./routes/carbonCredits";
import paymentRoutes from "./routes/payments";

export function createServer() {
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api", limiter);

  // Basic middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com']
      : ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "MRV API is working!";
    res.json({
      message: ping,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/demo", handleDemo);

  // MRV System routes
  app.use("/api/auth", authRoutes);
  app.use("/api/farmers", farmerRoutes);
  app.use("/api/fields", fieldRoutes);
  app.use("/api/measurements", measurementRoutes);
  app.use("/api/carbon-credits", carbonCreditRoutes);
  app.use("/api/payments", paymentRoutes);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
}
