import type { Express } from "express";
import { storage } from "../storage";
import { insertDraegerCalibrationSchema } from "@shared/schema";

export function registerDraegerCalibrationRoutes(app: Express) {
  app.get("/api/draeger-calibrations", async (_req, res) => {
    try {
      res.json(await storage.getAllDraegerCalibrations());
    } catch {
      res.status(500).json({ error: "Failed to fetch Draeger calibrations" });
    }
  });

  app.get("/api/draeger-calibrations/:id", async (req, res) => {
    try {
      const item = await storage.getDraegerCalibration(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Draeger calibration not found" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Failed to fetch Draeger calibration" });
    }
  });

  app.post("/api/draeger-calibrations", async (req, res) => {
    try {
      const data = insertDraegerCalibrationSchema.parse(req.body);
      res.status(201).json(await storage.createDraegerCalibration(data));
    } catch {
      res.status(400).json({ error: "Invalid Draeger calibration data" });
    }
  });

  app.patch("/api/draeger-calibrations/:id", async (req, res) => {
    try {
      const updated = await storage.updateDraegerCalibration(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Draeger calibration not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update Draeger calibration" });
    }
  });

  app.delete("/api/draeger-calibrations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDraegerCalibration(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Draeger calibration not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete Draeger calibration" });
    }
  });
}
