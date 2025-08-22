import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectToDatabase } from "./lib/database";

export async function createServer() {
  const app = express();

  // Connect to MongoDB
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Continue without database for now
  }

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

  return app;
}
