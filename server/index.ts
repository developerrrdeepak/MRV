import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectToDatabase } from "./lib/database";
// Import farmer routes
import {
  getFarmers,
  getFarmerById,
  getFarmerByFarmerId,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  addFarmerToProject,
  getFarmersByLocation,
  getFarmerStats,
} from "./routes/farmers";
// Import project routes
import {
  getProjects,
  getProjectById,
  getProjectByProjectId,
  createProject,
  updateProject,
  deleteProject,
  addFarmersToProject,
  removeFarmerFromProject,
  getProjectMetrics,
  getProjectStats,
} from "./routes/projects";

export async function createServer() {
  const app = express();

  // Connect to MongoDB
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
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

  // Farmer routes
  app.get("/api/farmers", getFarmers);
  app.get("/api/farmers/stats", getFarmerStats);
  app.get("/api/farmers/location", getFarmersByLocation);
  app.get("/api/farmers/id/:farmerId", getFarmerByFarmerId);
  app.get("/api/farmers/:id", getFarmerById);
  app.post("/api/farmers", createFarmer);
  app.put("/api/farmers/:id", updateFarmer);
  app.delete("/api/farmers/:id", deleteFarmer);
  app.post("/api/farmers/project", addFarmerToProject);

  // Carbon Project routes
  app.get("/api/projects", getProjects);
  app.get("/api/projects/stats", getProjectStats);
  app.get("/api/projects/id/:projectId", getProjectByProjectId);
  app.get("/api/projects/:id", getProjectById);
  app.get("/api/projects/:id/metrics", getProjectMetrics);
  app.post("/api/projects", createProject);
  app.put("/api/projects/:id", updateProject);
  app.delete("/api/projects/:id", deleteProject);
  app.post("/api/projects/:id/farmers", addFarmersToProject);
  app.delete(
    "/api/projects/:projectId/farmers/:farmerId",
    removeFarmerFromProject,
  );

  return app;
}
