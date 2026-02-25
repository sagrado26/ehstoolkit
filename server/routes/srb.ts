import type { Express } from "express";
import { storage } from "../storage";

export function registerSRBRoutes(app: Express) {
  // GET /api/srb-records
  app.get("/api/srb-records", async (_req, res) => {
    try {
      res.json(await storage.getAllSRBRecords());
    } catch {
      res.status(500).json({ error: "Failed to fetch SRB records" });
    }
  });

  // GET /api/srb-records/:id
  app.get("/api/srb-records/:id", async (req, res) => {
    try {
      const record = await storage.getSRBRecord(parseInt(req.params.id));
      if (!record) return res.status(404).json({ error: "SRB record not found" });
      res.json(record);
    } catch {
      res.status(500).json({ error: "Failed to fetch SRB record" });
    }
  });

  // GET /api/srb-records/safety-plan/:safetyPlanId
  app.get("/api/srb-records/safety-plan/:safetyPlanId", async (req, res) => {
    try {
      const record = await storage.getSRBRecordBySafetyPlanId(parseInt(req.params.safetyPlanId));
      if (!record) return res.status(404).json({ error: "No SRB record for this safety plan" });
      res.json(record);
    } catch {
      res.status(500).json({ error: "Failed to fetch SRB record" });
    }
  });

  // POST /api/srb-records
  app.post("/api/srb-records", async (req, res) => {
    try {
      const record = await storage.createSRBRecord(req.body);
      res.status(201).json(record);
    } catch {
      res.status(500).json({ error: "Failed to create SRB record" });
    }
  });

  // PATCH /api/srb-records/:id
  app.patch("/api/srb-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const record = await storage.updateSRBRecord(id, req.body);
      if (!record) return res.status(404).json({ error: "SRB record not found" });
      res.json(record);
    } catch {
      res.status(500).json({ error: "Failed to update SRB record" });
    }
  });

  // POST /api/srb-records/:id/complete
  app.post("/api/srb-records/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getSRBRecord(id);
      if (!existing) return res.status(404).json({ error: "SRB record not found" });

      // Validate all reassessments are LOW
      const allLow = (existing.reassessments || []).every(
        (r) => r.newSeverity * r.newLikelihood <= 3
      );
      if (!allLow) {
        return res.status(400).json({ error: "All escalated hazards must reach LOW risk before completion" });
      }

      // Validate all signatories present
      const allSigned = (existing.signatories || []).length >= 3 &&
        (existing.signatories || []).every((s) => s.name && s.signatureData);
      if (!allSigned) {
        return res.status(400).json({ error: "All three mandatory signatures are required" });
      }

      const record = await storage.updateSRBRecord(id, { status: "completed" });
      res.json(record);
    } catch {
      res.status(500).json({ error: "Failed to complete SRB record" });
    }
  });

  // DELETE /api/srb-records/:id
  app.delete("/api/srb-records/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSRBRecord(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "SRB record not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete SRB record" });
    }
  });
}
