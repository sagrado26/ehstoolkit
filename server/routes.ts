import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerSafetyPlanRoutes } from "./routes/safety-plans";
import { registerPermitRoutes } from "./routes/permits";
import { registerCraneInspectionRoutes } from "./routes/crane-inspections";
import { registerDraegerCalibrationRoutes } from "./routes/draeger-calibrations";
import { registerIncidentRoutes } from "./routes/incidents";
import { registerDocumentRoutes } from "./routes/documents";
import { registerSRBRoutes } from "./routes/srb";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const useDatabase = process.env.USE_DATABASE === "true";
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      storageMode: useDatabase ? "PostgreSQL Database" : "In-Memory"
    });
  });

  registerSafetyPlanRoutes(app);
  registerPermitRoutes(app);
  registerCraneInspectionRoutes(app);
  registerDraegerCalibrationRoutes(app);
  registerIncidentRoutes(app);
  registerDocumentRoutes(app);
  registerSRBRoutes(app);
  return createServer(app);
}
