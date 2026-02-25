import type { Express } from "express";
import { storage } from "../storage";
import { insertPermitSchema, insertGasMeasurementSchema, insertPermitApprovalSchema, insertPermitSignOffSchema } from "@shared/schema";

export function registerPermitRoutes(app: Express) {
  // ── Permits CRUD ────────────────────────────────────────────────────────
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
      const permit = await storage.createPermit(data);

      // Auto-create approval records for pending permits
      if (data.status === "pending") {
        await storage.createPermitApproval({
          permitId: permit.id,
          approverRole: "Local EHS",
          approverName: "",
          status: "pending",
        });
        await storage.createPermitApproval({
          permitId: permit.id,
          approverRole: "Responsible Manager",
          approverName: data.manager,
          status: "pending",
        });
      }

      res.status(201).json(permit);
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

  // ── Gas Measurements ──────────────────────────────────────────────────
  app.get("/api/permits/:id/gas-measurements", async (req, res) => {
    try {
      res.json(await storage.getGasMeasurements(parseInt(req.params.id)));
    } catch {
      res.status(500).json({ error: "Failed to fetch gas measurements" });
    }
  });

  app.post("/api/permits/:id/gas-measurements", async (req, res) => {
    try {
      const data = insertGasMeasurementSchema.parse({
        ...req.body,
        permitId: parseInt(req.params.id),
      });

      // Check thresholds and set alert flag
      const o2 = parseFloat(data.o2Level);
      const co2 = parseFloat(data.co2Level);
      const co = parseFloat(data.coLevel);
      const h2s = parseFloat(data.h2sLevel || "0");
      const lel = parseFloat(data.lelLevel || "0");

      if (o2 < 19.5 || o2 > 23.5 || co2 >= 0.5 || co >= 50 || h2s >= 10 || lel >= 10) {
        data.alertTriggered = "yes";
      }

      const measurement = await storage.createGasMeasurement(data);
      res.status(201).json(measurement);
    } catch {
      res.status(400).json({ error: "Invalid gas measurement data" });
    }
  });

  // ── Permit Approvals ──────────────────────────────────────────────────
  app.get("/api/permits/:id/approvals", async (req, res) => {
    try {
      res.json(await storage.getPermitApprovals(parseInt(req.params.id)));
    } catch {
      res.status(500).json({ error: "Failed to fetch approvals" });
    }
  });

  app.post("/api/permits/:id/approvals", async (req, res) => {
    try {
      const data = insertPermitApprovalSchema.parse({
        ...req.body,
        permitId: parseInt(req.params.id),
      });
      res.status(201).json(await storage.createPermitApproval(data));
    } catch {
      res.status(400).json({ error: "Invalid approval data" });
    }
  });

  app.patch("/api/permits/:permitId/approvals/:id", async (req, res) => {
    try {
      const updated = await storage.updatePermitApproval(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Approval not found" });

      // Check if all approvals for this permit are approved → update permit status
      const approvals = await storage.getPermitApprovals(parseInt(req.params.permitId));
      const allApproved = approvals.length > 0 && approvals.every(a => a.status === "approved");
      const anyRejected = approvals.some(a => a.status === "rejected");

      if (allApproved) {
        await storage.updatePermit(parseInt(req.params.permitId), { status: "approved" });
      } else if (anyRejected) {
        await storage.updatePermit(parseInt(req.params.permitId), { status: "draft" });
      }

      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update approval" });
    }
  });

  // ── Permit Sign-Offs ──────────────────────────────────────────────────
  app.get("/api/permits/:id/sign-offs", async (req, res) => {
    try {
      res.json(await storage.getPermitSignOffs(parseInt(req.params.id)));
    } catch {
      res.status(500).json({ error: "Failed to fetch sign-offs" });
    }
  });

  app.post("/api/permits/:id/sign-offs", async (req, res) => {
    try {
      const data = insertPermitSignOffSchema.parse({
        ...req.body,
        permitId: parseInt(req.params.id),
      });
      res.status(201).json(await storage.createPermitSignOff(data));
    } catch {
      res.status(400).json({ error: "Invalid sign-off data" });
    }
  });
}
