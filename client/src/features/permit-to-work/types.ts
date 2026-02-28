export type PermitTab =
  | "details"
  | "precautions"
  | "type-specific"
  | "srb"
  | "authority"
  | "cs-space"
  | "cs-hazards"
  | "cs-tools"
  | "cs-emergency";

export type PermitTypeId = "confined-space" | "hazardous-space" | "hazardous-chemicals";

// ── JSONB sub-types (Confined Space) ───────────────────────────────────

export type SpaceIdentification = {
  sourceVessel: boolean;
  driveLaserCompartments: boolean;
  scannerSourceArea: boolean;
  areaUnderSourceSBF: boolean;
  other: string;
};

export type CommunicationMethod = {
  verbalVisual: boolean;
  radio: boolean;
  other: boolean;
  otherDescription: string;
};

export type PhysicalHazardItem = {
  id: string;
  hazardLabel: string;
  controlLabel: string;
  hazardPresent: boolean;
  controlApplied: boolean;
};

export type AtmosphericHazardItem = {
  id: string;
  hazardLabel: string;
  monitorLabel: string;
  hazardPresent: boolean;
  monitorDeployed: boolean;
};

export type ToolChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

export type ExtractionSituation = {
  id: string;
  label: string;
  applicable: boolean;
};

export type ExtractionMethod = {
  id: string;
  label: string;
  selected: boolean;
};

export type ExtractionEquipment = {
  id: string;
  label: string;
  available: boolean;
};

export type MedicalEquipmentItem = {
  id: string;
  label: string;
  available: boolean;
};

export type EnhancedSignOff = {
  ehsSpecialistName: string;
  ehsSpecialistDate: string;
  ehsSpecialistSignature: string;
  managerName: string;
  managerDate: string;
  managerSignature: string;
};

// ── Main form data ─────────────────────────────────────────────────────

export type PermitFormData = {
  // ── Existing: Permit Details ──
  date: string;
  submitter: string;
  manager: string;
  location: string;
  workType: "Hot Work" | "Cold Work" | "Electrical" | "Working at Height" | "Confined Space" | "Mechanical";
  permitType: PermitTypeId | "general";
  workDescription: string;

  // ── Existing: Safety Precautions ──
  spq1: "yes" | "no";
  spq2: "yes" | "no";
  spq3: "yes" | "no";
  spq4: "yes" | "no";
  spq5: "yes" | "no";

  // ── Existing: Authority ──
  authorityName: string;
  status: "draft" | "pending" | "approved";

  // ── Existing: Confined Space ──
  o2Level: string;
  nitrogenPurge: string;
  entrySupervisor: string;
  standbyPerson: string;

  // ── Existing: Hazardous Space ──
  hazardAssessment: string;
  respiratoryProtection: string;
  isolationMethods: string;

  // ── Existing: Hazardous Chemicals ──
  chemicalInventory: string;
  sdsDocuments: string;
  ppeRequirements: string;
  containmentPlan: string;

  // ── Existing: SRB ──
  srbRequired: string;
  srbPrimaryRoute: string;
  srbSecondaryRoute: string;
  srbAssemblyPoint: string;
  srbEmergencyContact: string;

  // ── NEW: General Info (all permit types) ──
  requestorPhone: string;
  serviceOrderNumber: string;
  procedureName: string;
  customerFab: string;
  machineType: string;
  machineNumber: string;
  customerNotified: "yes" | "no";
  customerContactName: string;
  customerContactPhone: string;
  activityDurationHours: string;
  expectedStartDate: string;
  expectedStartTime: string;
  expectedEndDate: string;
  expectedEndTime: string;
  multipleShifts: "yes" | "no";

  // ── NEW: Confined Space — Space ID & Personnel ──
  spaceIdentification: SpaceIdentification;
  attendants: string;
  entrants: string;
  atmosphericTester: string;
  communicationMethod: CommunicationMethod;
  extractionPlanReviewed: "yes" | "no";

  // ── NEW: Confined Space — Hazards ──
  physicalHazards: PhysicalHazardItem[];
  atmosphericHazards: AtmosphericHazardItem[];

  // ── NEW: Confined Space — Tools ──
  toolsChecklist: ToolChecklistItem[];

  // ── NEW: Confined Space — Emergency ──
  ertContactInfo: string;
  extractionSituations: ExtractionSituation[];
  extractionMethods: ExtractionMethod[];
  extractionEquipment: ExtractionEquipment[];
  medicalEquipment: MedicalEquipmentItem[];

  // ── NEW: Enhanced Sign-off ──
  enhancedSignOff: EnhancedSignOff;
};
