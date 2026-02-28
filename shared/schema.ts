import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Assessment type for hazard risk assessments
export type Assessment = { severity: number; likelihood: number; mitigation: string };

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Safety Plans table - comprehensive pre-task plan
export const safetyPlans = pgTable("safety_plans", {
  id: serial("id").primaryKey(),
  group: text("group").notNull(),
  taskName: text("task_name").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  shift: text("shift").notNull(),
  machineNumber: text("machine_number").notNull(),
  region: text("region").notNull().default("Europe - Ireland"),
  system: text("system").notNull().default("Others"),
  canSocialDistance: text("can_social_distance").notNull(),
  q1_specializedTraining: text("q1_specialized_training").notNull(),
  q2_chemicals: text("q2_chemicals").notNull(),
  q3_impactOthers: text("q3_impact_others").notNull(),
  q4_falls: text("q4_falls").notNull(),
  q5_barricades: text("q5_barricades").notNull(),
  q6_loto: text("q6_loto").notNull(),
  q7_lifting: text("q7_lifting").notNull(),
  q8_ergonomics: text("q8_ergonomics").notNull(),
  q9_otherConcerns: text("q9_other_concerns").notNull(),
  q10_headInjury: text("q10_head_injury").notNull(),
  q11_otherPPE: text("q11_other_ppe").notNull(),
  hazards: jsonb("hazards").$type<string[]>().default([]),
  assessments: jsonb("assessments").$type<Record<string, Assessment>>().default({}),
  leadName: text("lead_name").notNull(),
  approverName: text("approver_name"),
  engineers: jsonb("engineers").$type<string[]>().default([]),
  comments: text("comments"),
  status: text("status").notNull().default("pending"),
  shareToken: text("share_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSafetyPlanSchema = createInsertSchema(safetyPlans).omit({
  id: true,
  createdAt: true,
});

export type SafetyPlan = typeof safetyPlans.$inferSelect;
export type InsertSafetyPlan = z.infer<typeof insertSafetyPlanSchema>;

// User Preferences table for storing user settings
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("default"),
  system: text("system").notNull().default("Others"),
  group: text("group").notNull().default("Europe"),
  site: text("site").notNull().default("F34 Intel Ireland"),
  isFirstTime: text("is_first_time").notNull().default("true"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Report List types for JSON fields
export type JobDetailsReport = {
  safetyPlanId: number;
  versionId: string;
  group: string;
  taskName: string;
  date: string;
  location: string;
  shift: string;
  machineNumber: string;
  region: string;
  system: string;
  leadName: string;
  approverName: string | null;
  engineers: string[];
  comments: string | null;
};

export type SafetyRiskReport = {
  safetyQuestions: {
    q1_specializedTraining: string;
    q2_chemicals: string;
    q3_impactOthers: string;
    q4_falls: string;
    q5_barricades: string;
    q6_loto: string;
    q7_lifting: string;
    q8_ergonomics: string;
    q9_otherConcerns: string;
    q10_headInjury: string;
    q11_otherPPE: string;
    canSocialDistance: string;
  };
  hazards: string[];
  assessments: Record<string, Assessment>;
};

export type SRBInfo = {
  required: boolean;
  hazardsRequiringSRB: string[];
  checklistsRequired: string[];
  notes: string | null;
};

export type ApprovalInfo = {
  currentStatus: string;
  versions: {
    versionId: string;
    status: string;
    submittedBy: string;
    submittedAt: string;
    approvedBy: string | null;
    approvedAt: string | null;
    comments: string | null;
  }[];
};

// Report List table - comprehensive JSON report of each submission
export const reportList = pgTable("report_list", {
  id: serial("id").primaryKey(),
  safetyPlanId: integer("safety_plan_id").notNull(),
  versionId: text("version_id").notNull(),
  jobDetails: jsonb("job_details").$type<JobDetailsReport>().notNull(),
  safetyRiskAssessment: jsonb("safety_risk_assessment").$type<SafetyRiskReport>().notNull(),
  srbInfo: jsonb("srb_info").$type<SRBInfo>().notNull(),
  approvalInfo: jsonb("approval_info").$type<ApprovalInfo>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportListSchema = createInsertSchema(reportList).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ReportList = typeof reportList.$inferSelect;
export type InsertReportList = z.infer<typeof insertReportListSchema>;

// Audit Log table - tracks all actions on safety plans
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  safetyPlanId: integer("safety_plan_id").notNull(),
  action: text("action").notNull(),
  performedBy: text("performed_by").notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  comments: text("comments"),
  changes: jsonb("changes").$type<Record<string, { old: unknown; new: unknown }>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// ─── Permits ───────────────────────────────────────────────────────────────
export const permits = pgTable("permits", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  submitter: text("submitter").notNull(),
  manager: text("manager").notNull(),
  location: text("location").notNull().default(""),
  workType: text("work_type").notNull().default(""),
  permitType: text("permit_type").notNull().default("general"),
  workDescription: text("work_description").notNull().default(""),
  spq1: text("spq1").notNull().default("no"),
  spq2: text("spq2").notNull().default("no"),
  spq3: text("spq3").notNull().default("no"),
  spq4: text("spq4").notNull().default("no"),
  spq5: text("spq5").notNull().default("no"),
  authorityName: text("authority_name").notNull().default(""),
  status: text("status").notNull().default("draft"),
  // Confined Space fields
  o2Level: text("o2_level"),
  nitrogenPurge: text("nitrogen_purge"),
  entrySupervisor: text("entry_supervisor"),
  standbyPerson: text("standby_person"),
  // Hazardous Space fields
  hazardAssessment: text("hazard_assessment"),
  respiratoryProtection: text("respiratory_protection"),
  isolationMethods: text("isolation_methods"),
  // Hazardous Chemicals fields
  chemicalInventory: text("chemical_inventory"),
  sdsDocuments: text("sds_documents"),
  ppeRequirements: text("ppe_requirements"),
  containmentPlan: text("containment_plan"),
  // SRB fields
  srbRequired: text("srb_required").default("no"),
  srbPrimaryRoute: text("srb_primary_route"),
  srbSecondaryRoute: text("srb_secondary_route"),
  srbAssemblyPoint: text("srb_assembly_point"),
  srbEmergencyContact: text("srb_emergency_contact"),

  // ── NEW: General Info fields ──
  requestorPhone: text("requestor_phone"),
  serviceOrderNumber: text("service_order_number"),
  procedureName: text("procedure_name"),
  customerFab: text("customer_fab"),
  machineType: text("machine_type"),
  machineNumber: text("machine_number"),
  customerNotified: text("customer_notified"),
  customerContactName: text("customer_contact_name"),
  customerContactPhone: text("customer_contact_phone"),
  activityDurationHours: text("activity_duration_hours"),
  expectedStartDate: text("expected_start_date"),
  expectedStartTime: text("expected_start_time"),
  expectedEndDate: text("expected_end_date"),
  expectedEndTime: text("expected_end_time"),
  multipleShifts: text("multiple_shifts"),

  // ── NEW: Confined Space — Personnel ──
  attendants: text("attendants"),
  entrants: text("entrants"),
  atmosphericTester: text("atmospheric_tester"),
  extractionPlanReviewed: text("extraction_plan_reviewed"),
  ertContactInfo: text("ert_contact_info"),

  // ── NEW: Confined Space — JSONB columns ──
  spaceIdentification: jsonb("space_identification"),
  communicationMethod: jsonb("communication_method"),
  physicalHazards: jsonb("physical_hazards"),
  atmosphericHazards: jsonb("atmospheric_hazards"),
  toolsChecklist: jsonb("tools_checklist"),
  extractionSituations: jsonb("extraction_situations"),
  extractionMethods: jsonb("extraction_methods"),
  extractionEquipment: jsonb("extraction_equipment"),
  medicalEquipment: jsonb("medical_equipment"),
  enhancedSignOff: jsonb("enhanced_sign_off"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPermitSchema = createInsertSchema(permits).omit({ id: true, createdAt: true });
export type Permit = typeof permits.$inferSelect;
export type InsertPermit = z.infer<typeof insertPermitSchema>;

// ─── Permit Gas Measurements ──────────────────────────────────────────────
export const permitGasMeasurements = pgTable("permit_gas_measurements", {
  id: serial("id").primaryKey(),
  permitId: integer("permit_id").notNull(),
  o2Level: text("o2_level").notNull(),
  co2Level: text("co2_level").notNull(),
  coLevel: text("co_level").notNull(),
  h2sLevel: text("h2s_level").notNull().default("0"),
  lelLevel: text("lel_level").notNull().default("0"),
  measuredBy: text("measured_by").notNull(),
  alertTriggered: text("alert_triggered").notNull().default("no"),
  notes: text("notes"),
  measuredAt: timestamp("measured_at").defaultNow(),
});

export const insertGasMeasurementSchema = createInsertSchema(permitGasMeasurements).omit({ id: true, measuredAt: true });
export type PermitGasMeasurement = typeof permitGasMeasurements.$inferSelect;
export type InsertGasMeasurement = z.infer<typeof insertGasMeasurementSchema>;

// ─── Permit Approvals ─────────────────────────────────────────────────────
export const permitApprovals = pgTable("permit_approvals", {
  id: serial("id").primaryKey(),
  permitId: integer("permit_id").notNull(),
  approverRole: text("approver_role").notNull(),
  approverName: text("approver_name").notNull(),
  status: text("status").notNull().default("pending"),
  comments: text("comments"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPermitApprovalSchema = createInsertSchema(permitApprovals).omit({ id: true, approvedAt: true, createdAt: true });
export type PermitApproval = typeof permitApprovals.$inferSelect;
export type InsertPermitApproval = z.infer<typeof insertPermitApprovalSchema>;

// ─── Permit Sign-Offs ─────────────────────────────────────────────────────
export const permitSignOffs = pgTable("permit_sign_offs", {
  id: serial("id").primaryKey(),
  permitId: integer("permit_id").notNull(),
  role: text("role").notNull(),
  signedBy: text("signed_by").notNull(),
  signatureData: text("signature_data"),
  signedAt: timestamp("signed_at").defaultNow(),
});

export const insertPermitSignOffSchema = createInsertSchema(permitSignOffs).omit({ id: true, signedAt: true });
export type PermitSignOff = typeof permitSignOffs.$inferSelect;
export type InsertPermitSignOff = z.infer<typeof insertPermitSignOffSchema>;

// ─── Safety Review Board (SRB) ──────────────────────────────────────────────
export type SRBPreQuestions = {
  reasonForEscalation: string;
  procedureOrCondition: string;
  serviceOrderNumber: string;
  coachUpdateNeeded: "yes" | "no";
  customerSafetyCompleted: "yes" | "no";
};

export type SRBHazardReassessment = {
  hazardName: string;
  originalSeverity: number;
  originalLikelihood: number;
  originalRiskScore: number;
  originalMitigation: string;
  additionalSafetyMeasures: string;
  mitigationPlan: string;
  newSeverity: number;
  newLikelihood: number;
};

export type SRBAcknowledgements = {
  ack1_hazardReEvaluated: boolean;
  ack2_participantsReviewed: boolean;
  ack3_controlsValidated: boolean;
  ack4_residualRiskAgreed: boolean;
  ack5_safeActionAcknowledged: boolean;
  ack6_newRiskAcceptable: boolean;
};

export type SRBSignatory = {
  role: "EHS Specialist" | "Fab Team Lead" | "CS Management";
  name: string;
  signatureData: string | null;
  signedAt: string | null;
};

export const srbRecords = pgTable("srb_records", {
  id: serial("id").primaryKey(),
  safetyPlanId: integer("safety_plan_id").notNull(),
  status: text("status").notNull().default("draft"),
  serviceOrderNumber: text("service_order_number").notNull().default(""),
  preQuestions: jsonb("pre_questions").$type<SRBPreQuestions>().notNull(),
  escalatedHazards: jsonb("escalated_hazards").$type<string[]>().notNull().default([]),
  originalAssessments: jsonb("original_assessments").$type<Record<string, Assessment>>().notNull().default({}),
  reassessments: jsonb("reassessments").$type<SRBHazardReassessment[]>().notNull().default([]),
  teamMembers: jsonb("team_members").$type<string[]>().notNull().default([]),
  acknowledgements: jsonb("acknowledgements").$type<SRBAcknowledgements | null>(),
  signatories: jsonb("signatories").$type<SRBSignatory[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSRBRecordSchema = createInsertSchema(srbRecords).omit({
  id: true, createdAt: true, updatedAt: true, completedAt: true,
});

export type SRBRecord = typeof srbRecords.$inferSelect;
export type InsertSRBRecord = z.infer<typeof insertSRBRecordSchema>;

// ─── Crane Inspections ──────────────────────────────────────────────────────
export const craneInspections = pgTable("crane_inspections", {
  id: serial("id").primaryKey(),
  inspector: text("inspector").notNull(),
  buddyInspector: text("buddy_inspector").notNull(),
  bay: text("bay").notNull(),
  machine: text("machine").notNull(),
  date: text("date").notNull(),
  q1: text("q1").notNull().default("no"),
  q2: text("q2").notNull().default("no"),
  q3: text("q3").notNull().default("no"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCraneInspectionSchema = createInsertSchema(craneInspections).omit({ id: true, createdAt: true });
export type CraneInspection = typeof craneInspections.$inferSelect;
export type InsertCraneInspection = z.infer<typeof insertCraneInspectionSchema>;

// ─── Draeger Calibrations ───────────────────────────────────────────────────
export const draegerCalibrations = pgTable("draeger_calibrations", {
  id: serial("id").primaryKey(),
  nc12: text("nc_12").notNull(),
  serialNumber: text("serial_number").notNull(),
  calibrationDate: text("calibration_date").notNull(),
  calibratedBy: text("calibrated_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDraegerCalibrationSchema = createInsertSchema(draegerCalibrations).omit({ id: true, createdAt: true, updatedAt: true });
export type DraegerCalibration = typeof draegerCalibrations.$inferSelect;
export type InsertDraegerCalibration = z.infer<typeof insertDraegerCalibrationSchema>;

// ─── Incidents ──────────────────────────────────────────────────────────────
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  severity: integer("severity").notNull().default(1),
  assignedInvestigator: text("assigned_investigator").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true, createdAt: true });
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;

// ─── Documents ──────────────────────────────────────────────────────────────
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  sharepointUrl: text("sharepoint_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Zod schema for form validation
export const safetyPlanFormSchema = z.object({
  group: z.string().min(1, "Group is required"),
  taskName: z.string().min(1, "Task description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  shift: z.string().min(1, "Shift is required"),
  machineNumber: z.string().min(1, "Machine Number is required"),
  region: z.string().default("Europe - Ireland"),
  system: z.enum(["EUV", "DUV", "CSCM", "Trumph", "Others"]).default("Others"),
  canSocialDistance: z.enum(["yes", "no"]),
  q1_specializedTraining: z.enum(["yes", "no"]),
  q2_chemicals: z.enum(["yes", "no"]),
  q3_impactOthers: z.enum(["yes", "no"]),
  q4_falls: z.enum(["yes", "no"]),
  q5_barricades: z.enum(["yes", "no"]),
  q6_loto: z.enum(["yes", "no"]),
  q7_lifting: z.enum(["yes", "no"]),
  q8_ergonomics: z.enum(["yes", "no"]),
  q9_otherConcerns: z.enum(["yes", "no"]),
  q10_headInjury: z.enum(["yes", "no"]),
  q11_otherPPE: z.enum(["yes", "no"]),
  hazards: z.array(z.string()).default([]),
  assessments: z.record(
    z.string(),
    z.object({
      severity: z.number().min(1).max(4),
      likelihood: z.number().min(1).max(4),
      mitigation: z.string()
    })
  ).default({}),
  leadName: z.string().min(1, "Lead Name is required"),
  approverName: z.string().optional(),
  engineers: z.array(z.string()).default([]),
  comments: z.string().optional(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).default("pending"),
});
