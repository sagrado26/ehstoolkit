import type { Express } from "express";
import { storage } from "../storage";
import { insertCraneInspectionSchema } from "@shared/schema";

export function registerCraneInspectionRoutes(app: Express) {
  app.get("/api/crane-inspections", async (_req, res) => {
    try {
      res.json(await storage.getAllCraneInspections());
    } catch {
      res.status(500).json({ error: "Failed to fetch crane inspections" });
    }
  });

  app.get("/api/crane-inspections/:id", async (req, res) => {
    try {
      const item = await storage.getCraneInspection(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Crane inspection not found" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Failed to fetch crane inspection" });
    }
  });

  app.post("/api/crane-inspections", async (req, res) => {
    try {
      const data = insertCraneInspectionSchema.parse(req.body);
      res.status(201).json(await storage.createCraneInspection(data));
    } catch {
      res.status(400).json({ error: "Invalid crane inspection data" });
    }
  });

  app.patch("/api/crane-inspections/:id", async (req, res) => {
    try {
      const updated = await storage.updateCraneInspection(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Crane inspection not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update crane inspection" });
    }
  });

  app.delete("/api/crane-inspections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCraneInspection(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Crane inspection not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete crane inspection" });
    }
  });
}
