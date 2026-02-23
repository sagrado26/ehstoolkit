import type { Express } from "express";
import { storage } from "../storage";
import { insertIncidentSchema } from "@shared/schema";

export function registerIncidentRoutes(app: Express) {
  app.get("/api/incidents", async (_req, res) => {
    try {
      res.json(await storage.getAllIncidents());
    } catch {
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/:id", async (req, res) => {
    try {
      const item = await storage.getIncident(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Incident not found" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Failed to fetch incident" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const data = insertIncidentSchema.parse(req.body);
      res.status(201).json(await storage.createIncident(data));
    } catch {
      res.status(400).json({ error: "Invalid incident data" });
    }
  });

  app.patch("/api/incidents/:id", async (req, res) => {
    try {
      const updated = await storage.updateIncident(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Incident not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update incident" });
    }
  });

  app.delete("/api/incidents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteIncident(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Incident not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete incident" });
    }
  });
}
