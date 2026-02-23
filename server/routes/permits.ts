import type { Express } from "express";
import { storage } from "../storage";
import { insertPermitSchema } from "@shared/schema";

export function registerPermitRoutes(app: Express) {
  app.get("/api/permits", async (_req, res) => {
    try {
      res.json(await storage.getAllPermits());
    } catch {
      res.status(500).json({ error: "Failed to fetch permits" });
    }
  });

  app.get("/api/permits/:id", async (req, res) => {
    try {
      const permit = await storage.getPermit(parseInt(req.params.id));
      if (!permit) return res.status(404).json({ error: "Permit not found" });
      res.json(permit);
    } catch {
      res.status(500).json({ error: "Failed to fetch permit" });
    }
  });

  app.post("/api/permits", async (req, res) => {
    try {
      const data = insertPermitSchema.parse(req.body);
      res.status(201).json(await storage.createPermit(data));
    } catch {
      res.status(400).json({ error: "Invalid permit data" });
    }
  });

  app.patch("/api/permits/:id", async (req, res) => {
    try {
      const updated = await storage.updatePermit(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Permit not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update permit" });
    }
  });

  app.delete("/api/permits/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePermit(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Permit not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete permit" });
    }
  });
}
