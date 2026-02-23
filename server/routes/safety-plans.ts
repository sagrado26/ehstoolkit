import type { Express } from "express";
import { storage } from "../storage";
import { insertSafetyPlanSchema, insertReportListSchema, type JobDetailsReport, type SafetyRiskReport, type SRBInfo, type ApprovalInfo } from "@shared/schema";
import { ZodError } from "zod";
import { randomUUID } from "crypto";

export function registerSafetyPlanRoutes(app: Express) {
  // Get all safety plans
  app.get("/api/safety-plans", async (req, res) => {
    try {
      const plans = await storage.getAllSafetyPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch safety plans" });
    }
  });

  // Get a single safety plan
  app.get("/api/safety-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getSafetyPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch safety plan" });
    }
  });

  // Create a new safety plan
  app.post("/api/safety-plans", async (req, res) => {
    try {
      const validatedData = insertSafetyPlanSchema.parse(req.body);
      const plan = await storage.createSafetyPlan(validatedData);

      const versionId = `v1.0-${randomUUID().slice(0, 8)}`;

      const hazardsWithChecklists = (plan.hazards || []).filter(h => {
        const checklistHazards = ["Hoisting or Crane Use", "Working at Height", "Electrical Work (LOTO)"];
        return checklistHazards.includes(h);
      });

      const jobDetails: JobDetailsReport = {
        safetyPlanId: plan.id,
        versionId,
        group: plan.group,
        taskName: plan.taskName,
        date: plan.date,
        location: plan.location,
        shift: plan.shift,
        machineNumber: plan.machineNumber,
        region: plan.region,
        system: plan.system,
        leadName: plan.leadName,
        approverName: plan.approverName || null,
        engineers: plan.engineers || [],
        comments: plan.comments || null,
      };

      const safetyRiskAssessment: SafetyRiskReport = {
        safetyQuestions: {
          q1_specializedTraining: plan.q1_specializedTraining,
          q2_chemicals: plan.q2_chemicals,
          q3_impactOthers: plan.q3_impactOthers,
          q4_falls: plan.q4_falls,
          q5_barricades: plan.q5_barricades,
          q6_loto: plan.q6_loto,
          q7_lifting: plan.q7_lifting,
          q8_ergonomics: plan.q8_ergonomics,
          q9_otherConcerns: plan.q9_otherConcerns,
          q10_headInjury: plan.q10_headInjury,
          q11_otherPPE: plan.q11_otherPPE,
          canSocialDistance: plan.canSocialDistance,
        },
        hazards: plan.hazards || [],
        assessments: plan.assessments || {},
      };

      const srbInfo: SRBInfo = {
        required: hazardsWithChecklists.length > 0,
        hazardsRequiringSRB: hazardsWithChecklists,
        checklistsRequired: hazardsWithChecklists.map(h => {
          if (h === "Hoisting or Crane Use") return "Pre Hoist / Crane Checklist";
          if (h === "Working at Height") return "Harness & MSLC Checklist";
          if (h === "Electrical Work (LOTO)") return "LOTO Checklist";
          return "";
        }).filter(Boolean),
        notes: null,
      };

      const approvalInfo: ApprovalInfo = {
        currentStatus: plan.status,
        versions: [{
          versionId,
          status: plan.status,
          submittedBy: plan.leadName,
          submittedAt: new Date().toISOString(),
          approvedBy: plan.status === "approved" ? plan.approverName || null : null,
          approvedAt: plan.status === "approved" ? new Date().toISOString() : null,
          comments: plan.comments || null,
        }],
      };

      await storage.createReport({
        safetyPlanId: plan.id,
        versionId,
        jobDetails,
        safetyRiskAssessment,
        srbInfo,
        approvalInfo,
      });

      await storage.createAuditLog({
        safetyPlanId: plan.id,
        action: "created",
        performedBy: plan.leadName,
        previousStatus: null,
        newStatus: plan.status,
        comments: null,
        changes: null,
      });

      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create safety plan" });
    }
  });

  // Update a safety plan
  app.patch("/api/safety-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSafetyPlanSchema.partial().parse(req.body);
      const plan = await storage.updateSafetyPlan(id, validatedData);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }
      res.json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update safety plan" });
    }
  });

  // Delete a safety plan
  app.delete("/api/safety-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSafetyPlan(id);
      if (!deleted) {
        return res.status(404).json({ error: "Safety plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete safety plan" });
    }
  });

  // User Preferences API
  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const prefs = await storage.getUserPreferences(userId);
      if (!prefs) {
        return res.json({ isFirstTime: "true", system: "Others", group: "Europe", site: "F34 Intel Ireland" });
      }
      res.json(prefs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/user-preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const prefs = await storage.upsertUserPreferences(userId, req.body);
      res.json(prefs);
    } catch (error) {
      res.status(500).json({ error: "Failed to save user preferences" });
    }
  });

  // Reports API
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.get("/api/reports/safety-plan/:safetyPlanId", async (req, res) => {
    try {
      const safetyPlanId = parseInt(req.params.safetyPlanId);
      const report = await storage.getReportBySafetyPlanId(safetyPlanId);
      if (!report) {
        return res.status(404).json({ error: "Report not found for this safety plan" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportListSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  app.patch("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.updateReport(id, req.body);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  // Approve a safety plan
  app.post("/api/safety-plans/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { approverName, comments } = req.body;

      if (!approverName) {
        return res.status(400).json({ error: "Approver name is required" });
      }

      const plan = await storage.getSafetyPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }

      if (plan.status === "approved") {
        return res.status(400).json({ error: "Plan is already approved" });
      }

      const previousStatus = plan.status;
      const updated = await storage.updateSafetyPlan(id, {
        status: "approved",
        approverName,
        comments: comments || plan.comments,
      });

      await storage.createAuditLog({
        safetyPlanId: id,
        action: "approved",
        performedBy: approverName,
        previousStatus,
        newStatus: "approved",
        comments: comments || null,
        changes: null,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve safety plan" });
    }
  });

  // Reject a safety plan
  app.post("/api/safety-plans/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { rejectedBy, comments } = req.body;

      if (!rejectedBy) {
        return res.status(400).json({ error: "Rejector name is required" });
      }
      if (!comments) {
        return res.status(400).json({ error: "Rejection reason is required" });
      }

      const plan = await storage.getSafetyPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }

      const previousStatus = plan.status;
      const updated = await storage.updateSafetyPlan(id, {
        status: "rejected",
        comments,
      });

      await storage.createAuditLog({
        safetyPlanId: id,
        action: "rejected",
        performedBy: rejectedBy,
        previousStatus,
        newStatus: "rejected",
        comments,
        changes: null,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject safety plan" });
    }
  });

  // Edit a safety plan
  app.put("/api/safety-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getSafetyPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }

      const previousStatus = plan.status;
      const editedBy = req.body.editedBy || plan.leadName;

      const changedFields: Record<string, { old: unknown; new: unknown }> = {};
      const updateFields = ["group", "taskName", "date", "location", "shift", "machineNumber", "region", "system",
        "canSocialDistance", "q1_specializedTraining", "q2_chemicals", "q3_impactOthers", "q4_falls",
        "q5_barricades", "q6_loto", "q7_lifting", "q8_ergonomics", "q9_otherConcerns", "q10_headInjury",
        "q11_otherPPE", "hazards", "assessments", "leadName", "approverName", "engineers", "comments"];

      for (const field of updateFields) {
        if (req.body[field] !== undefined) {
          const oldVal = (plan as Record<string, unknown>)[field];
          const newVal = req.body[field];
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            changedFields[field] = { old: oldVal, new: newVal };
          }
        }
      }

      const updateData: Record<string, unknown> = {};
      for (const field of updateFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (previousStatus === "approved" || previousStatus === "rejected") {
        updateData.status = "pending";
      }

      const updated = await storage.updateSafetyPlan(id, updateData as Partial<typeof plan>);

      await storage.createAuditLog({
        safetyPlanId: id,
        action: "edited",
        performedBy: editedBy,
        previousStatus,
        newStatus: (updateData.status as string) || previousStatus,
        comments: Object.keys(changedFields).length > 0 ? `Edited fields: ${Object.keys(changedFields).join(", ")}` : "No changes detected",
        changes: Object.keys(changedFields).length > 0 ? changedFields : null,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to edit safety plan" });
    }
  });

  // Log a reuse event on the original plan
  app.post("/api/safety-plans/:id/reuse-log", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reusedBy, newPlanId } = req.body;

      const plan = await storage.getSafetyPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Safety plan not found" });
      }

      await storage.createAuditLog({
        safetyPlanId: id,
        action: "reused",
        performedBy: reusedBy || "Unknown",
        previousStatus: plan.status,
        newStatus: plan.status,
        comments: `This plan was reused as a template for a new entry (ISP-${String(newPlanId).padStart(4, "0")}).`,
        changes: { reusedAsId: newPlanId },
      });

      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to log reuse" });
    }
  });

  // Get audit logs
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const safetyPlanId = req.query.safetyPlanId ? parseInt(req.query.safetyPlanId as string) : undefined;
      const logs = await storage.getAuditLogs(safetyPlanId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/export/sharepoint", async (req, res) => {
    try {
      const plans = await storage.getAllSafetyPlans();
      const exportData = plans.map(plan => ({
        Title: plan.taskName,
        TaskName: plan.taskName,
        Group: plan.group,
        Date: plan.date,
        Location: plan.location,
        Shift: plan.shift,
        MachineNumber: plan.machineNumber,
        Region: plan.region,
        System: plan.system,
        Q1_SpecializedTraining: plan.q1_specializedTraining || "no",
        Q2_Chemicals: plan.q2_chemicals || "no",
        Q3_ImpactOthers: plan.q3_impactOthers || "no",
        Q4_Falls: plan.q4_falls || "no",
        Q5_Barricades: plan.q5_barricades || "no",
        Q6_Loto: plan.q6_loto || "no",
        Q7_Lifting: plan.q7_lifting || "no",
        Q8_Ergonomics: plan.q8_ergonomics || "no",
        Q9_OtherConcerns: plan.q9_otherConcerns || "no",
        Q10_HeadInjury: plan.q10_headInjury || "no",
        Q11_OtherPPE: plan.q11_otherPPE || "no",
        Hazards: JSON.stringify(plan.hazards || []),
        LeadName: plan.leadName,
        ApproverName: plan.approverName,
        Engineers: JSON.stringify(plan.engineers || []),
        Comments: plan.comments,
        Status: plan.status,
      }));
      res.json({
        listName: "PTPSafetyPlans",
        itemCount: exportData.length,
        items: exportData,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to export data for SharePoint" });
    }
  });
}
