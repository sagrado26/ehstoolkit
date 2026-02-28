import { z } from "zod";

// ── Sub-schemas for JSONB types ────────────────────────────────────────

const spaceIdentificationSchema = z.object({
  sourceVessel: z.boolean(),
  driveLaserCompartments: z.boolean(),
  scannerSourceArea: z.boolean(),
  areaUnderSourceSBF: z.boolean(),
  other: z.string(),
}).default({
  sourceVessel: false, driveLaserCompartments: false,
  scannerSourceArea: false, areaUnderSourceSBF: false, other: "",
});

const communicationMethodSchema = z.object({
  verbalVisual: z.boolean(),
  radio: z.boolean(),
  other: z.boolean(),
  otherDescription: z.string(),
}).default({
  verbalVisual: false, radio: false, other: false, otherDescription: "",
});

const physicalHazardItemSchema = z.object({
  id: z.string(),
  hazardLabel: z.string(),
  controlLabel: z.string(),
  hazardPresent: z.boolean(),
  controlApplied: z.boolean(),
});

const atmosphericHazardItemSchema = z.object({
  id: z.string(),
  hazardLabel: z.string(),
  monitorLabel: z.string(),
  hazardPresent: z.boolean(),
  monitorDeployed: z.boolean(),
});

const toolChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  checked: z.boolean(),
});

const extractionSituationSchema = z.object({
  id: z.string(),
  label: z.string(),
  applicable: z.boolean(),
});

const extractionMethodSchema = z.object({
  id: z.string(),
  label: z.string(),
  selected: z.boolean(),
});

const extractionEquipmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
});

const medicalEquipmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
});

const enhancedSignOffSchema = z.object({
  ehsSpecialistName: z.string(),
  ehsSpecialistDate: z.string(),
  ehsSpecialistSignature: z.string(),
  managerName: z.string(),
  managerDate: z.string(),
  managerSignature: z.string(),
}).default({
  ehsSpecialistName: "", ehsSpecialistDate: "", ehsSpecialistSignature: "",
  managerName: "", managerDate: "", managerSignature: "",
});

// ── Main permit form schema ────────────────────────────────────────────

export const permitFormSchema = z.object({
  // ── Existing: Permit Details ──
  date: z.string().min(1, "Required"),
  submitter: z.string().min(1, "Required"),
  manager: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  workType: z.enum(["Hot Work", "Cold Work", "Electrical", "Working at Height", "Confined Space", "Mechanical"]),
  permitType: z.string().default("general"),
  workDescription: z.string().min(1, "Required"),

  // ── Existing: Safety Precautions ──
  spq1: z.enum(["yes", "no"]),
  spq2: z.enum(["yes", "no"]),
  spq3: z.enum(["yes", "no"]),
  spq4: z.enum(["yes", "no"]),
  spq5: z.enum(["yes", "no"]),

  // ── Existing: Authority ──
  authorityName: z.string(),
  status: z.enum(["draft", "pending", "approved"]),

  // ── Existing: Confined Space ──
  o2Level: z.string().default(""),
  nitrogenPurge: z.string().default(""),
  entrySupervisor: z.string().default(""),
  standbyPerson: z.string().default(""),

  // ── Existing: Hazardous Space ──
  hazardAssessment: z.string().default(""),
  respiratoryProtection: z.string().default(""),
  isolationMethods: z.string().default(""),

  // ── Existing: Hazardous Chemicals ──
  chemicalInventory: z.string().default(""),
  sdsDocuments: z.string().default(""),
  ppeRequirements: z.string().default(""),
  containmentPlan: z.string().default(""),

  // ── Existing: SRB ──
  srbRequired: z.string().default("no"),
  srbPrimaryRoute: z.string().default(""),
  srbSecondaryRoute: z.string().default(""),
  srbAssemblyPoint: z.string().default(""),
  srbEmergencyContact: z.string().default(""),

  // ── NEW: General Info ──
  requestorPhone: z.string().default(""),
  serviceOrderNumber: z.string().default(""),
  procedureName: z.string().default(""),
  customerFab: z.string().default(""),
  machineType: z.string().default(""),
  machineNumber: z.string().default(""),
  customerNotified: z.enum(["yes", "no"]).default("no"),
  customerContactName: z.string().default(""),
  customerContactPhone: z.string().default(""),
  activityDurationHours: z.string().default(""),
  expectedStartDate: z.string().default(""),
  expectedStartTime: z.string().default(""),
  expectedEndDate: z.string().default(""),
  expectedEndTime: z.string().default(""),
  multipleShifts: z.enum(["yes", "no"]).default("no"),

  // ── NEW: Confined Space — Space ID & Personnel ──
  spaceIdentification: spaceIdentificationSchema,
  attendants: z.string().default(""),
  entrants: z.string().default(""),
  atmosphericTester: z.string().default(""),
  communicationMethod: communicationMethodSchema,
  extractionPlanReviewed: z.enum(["yes", "no"]).default("no"),

  // ── NEW: Confined Space — Hazards ──
  physicalHazards: z.array(physicalHazardItemSchema).default([]),
  atmosphericHazards: z.array(atmosphericHazardItemSchema).default([]),

  // ── NEW: Confined Space — Tools ──
  toolsChecklist: z.array(toolChecklistItemSchema).default([]),

  // ── NEW: Confined Space — Emergency ──
  ertContactInfo: z.string().default(""),
  extractionSituations: z.array(extractionSituationSchema).default([]),
  extractionMethods: z.array(extractionMethodSchema).default([]),
  extractionEquipment: z.array(extractionEquipmentSchema).default([]),
  medicalEquipment: z.array(medicalEquipmentSchema).default([]),

  // ── NEW: Enhanced Sign-off ──
  enhancedSignOff: enhancedSignOffSchema,
});

export type PermitFormSchemaType = z.infer<typeof permitFormSchema>;
