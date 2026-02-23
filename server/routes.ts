import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerSafetyPlanRoutes } from "./routes/safety-plans";
import { registerPermitRoutes } from "./routes/permits";
import { registerCraneInspectionRoutes } from "./routes/crane-inspections";
import { registerDraegerCalibrationRoutes } from "./routes/draeger-calibrations";
import { registerIncidentRoutes } from "./routes/incidents";
import { registerDocumentRoutes } from "./routes/documents";

export async function registerRoutes(app: Express): Promise<Server> {
  registerSafetyPlanRoutes(app);
  registerPermitRoutes(app);
  registerCraneInspectionRoutes(app);
  registerDraegerCalibrationRoutes(app);
  registerIncidentRoutes(app);
  registerDocumentRoutes(app);
  return createServer(app);
}
