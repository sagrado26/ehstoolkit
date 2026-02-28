import type {
  SpaceIdentification,
  CommunicationMethod,
  PhysicalHazardItem,
  AtmosphericHazardItem,
  ToolChecklistItem,
  ExtractionSituation,
  ExtractionMethod,
  ExtractionEquipment,
  MedicalEquipmentItem,
  EnhancedSignOff,
} from "./types";

// ── Section 2: Permit Required Confined Space ──────────────────────────
export const DEFAULT_SPACE_IDENTIFICATION: SpaceIdentification = {
  sourceVessel: false,
  driveLaserCompartments: false,
  scannerSourceArea: false,
  areaUnderSourceSBF: false,
  other: "",
};

// ── Section 6: Communication Method ────────────────────────────────────
export const DEFAULT_COMMUNICATION_METHOD: CommunicationMethod = {
  verbalVisual: false,
  radio: false,
  other: false,
  otherDescription: "",
};

// ── Section 7a: Physical Hazards + Controls ────────────────────────────
export const DEFAULT_PHYSICAL_HAZARDS: PhysicalHazardItem[] = [
  { id: "mechanical-electrical", hazardLabel: "Mechanical / Electrical", controlLabel: "Lockout/Tagout (LOTO)", hazardPresent: false, controlApplied: false },
  { id: "lasers", hazardLabel: "Lasers", controlLabel: "Lockout/Tagout (LOTO)", hazardPresent: false, controlApplied: false },
  { id: "gasses", hazardLabel: "Gasses", controlLabel: "Ventilation via opposite doors / Vacuum out gasses", hazardPresent: false, controlApplied: false },
  { id: "sharp-edges", hazardLabel: "Sharp edges", controlLabel: "Bumpcap / Cut resistant gloves / Gloves", hazardPresent: false, controlApplied: false },
  { id: "high-temperature", hazardLabel: "High Temperature", controlLabel: "Measure before entry", hazardPresent: false, controlApplied: false },
  { id: "dust-particles", hazardLabel: "Dust/particles hazards — Tin/Thorium", controlLabel: "Respirator, full/half face mask with P100 cartridge", hazardPresent: false, controlApplied: false },
  { id: "enter-exit-egress", hazardLabel: "Enter and exit (egress)", controlLabel: "Attendant to assist going in/out", hazardPresent: false, controlApplied: false },
  { id: "ergonomics", hazardLabel: "Ergonomics (awkward postures, bending, lifting)", controlLabel: "Frequent breaks / green pads / ergoplate / vessel entry tool", hazardPresent: false, controlApplied: false },
  { id: "tight-spaces", hazardLabel: "Tight Spaces (Entrapment Hazard)", controlLabel: "Verify space is compatible with body type for entry", hazardPresent: false, controlApplied: false },
  { id: "working-at-height", hazardLabel: "Working at Height (above 1.2 m / 4 ft)", controlLabel: "Ladder / Platform", hazardPresent: false, controlApplied: false },
  { id: "others-physical", hazardLabel: "Others", controlLabel: "Other controls (specify)", hazardPresent: false, controlApplied: false },
];

// ── Section 7b: Atmospheric Hazards + Monitors ─────────────────────────
export const DEFAULT_ATMOSPHERIC_HAZARDS: AtmosphericHazardItem[] = [
  { id: "asphyxiation-o2", hazardLabel: "Asphyxiation / Oxygen Deficiency (Argon/Nitrogen/Helium)", monitorLabel: "Oxygen area monitor — initial & continuous, record every 15 min", hazardPresent: false, monitorDeployed: false },
  { id: "toxic-co2-co", hazardLabel: "Toxic gas — Carbon Dioxide / Carbon Monoxide", monitorLabel: "CO₂ area monitor — initial & continuous, record every 15 min", hazardPresent: false, monitorDeployed: false },
  { id: "others-atmospheric", hazardLabel: "Others", monitorLabel: "CO area monitor — initial & continuous, record every 15 min", hazardPresent: false, monitorDeployed: false },
];

// ── Section 8: Tools ───────────────────────────────────────────────────
export const DEFAULT_TOOLS_CHECKLIST: ToolChecklistItem[] = [
  { id: "personal-gas-monitor", label: "Personal gas monitor (Yellow Canary for O₂ / Orange monitor for CO₂)", checked: false },
  { id: "loto-equipment", label: "LOTO equipment — Personal Locks and Tags", checked: false },
  { id: "ergonomics-tools", label: "Ergonomics — Ergoplate / Vessel Entry Tool (VET)", checked: false },
  { id: "lighting", label: "Lighting — LED Flashlight", checked: false },
  { id: "controlled-access-zone", label: "Controlled Access Zone — Barricades and signage", checked: false },
  { id: "others-tools", label: "Others", checked: false },
];

// ── Section 9b: Potential Extraction Situations ────────────────────────
export const DEFAULT_EXTRACTION_SITUATIONS: ExtractionSituation[] = [
  { id: "entrapment", label: "Entrapment", applicable: false },
  { id: "fire-explosion", label: "Fire / Explosion", applicable: false },
  { id: "engulfment", label: "Engulfment", applicable: false },
  { id: "hazardous-atmosphere", label: "Hazardous Atmosphere", applicable: false },
  { id: "working-at-height", label: "Working at Height", applicable: false },
  { id: "electrical", label: "Electrical", applicable: false },
  { id: "hazardous-chemicals", label: "Hazardous Chemicals", applicable: false },
  { id: "other-situation", label: "Other", applicable: false },
];

// ── Section 9c: Method of Extraction ───────────────────────────────────
export const DEFAULT_EXTRACTION_METHODS: ExtractionMethod[] = [
  { id: "asml-trained", label: "ASML trained Employee(s)", selected: false },
  { id: "customer-ert", label: "Customer Site ERT Team (back-up for Confined Space)", selected: false },
  { id: "other-method", label: "Other", selected: false },
];

// ── Section 9d: Extraction Equipment ───────────────────────────────────
export const DEFAULT_EXTRACTION_EQUIPMENT: ExtractionEquipment[] = [
  { id: "ergoplate-vet", label: "Ergoplate / Vessel Entry Tool (VET)", available: false },
  { id: "align-extraction", label: "Align the extraction — how to be performed", available: false },
  { id: "platform", label: "Platform", available: false },
  { id: "ladder", label: "Ladder", available: false },
  { id: "exe-vessel-toolkit", label: "EXE Vessel Extraction Toolkit", available: false },
  { id: "backboard", label: "Backboard", available: false },
  { id: "other-equipment", label: "Other", available: false },
];

// ── Section 10: Medical Equipment ──────────────────────────────────────
export const DEFAULT_MEDICAL_EQUIPMENT: MedicalEquipmentItem[] = [
  { id: "first-aid-kit", label: "First AID kit", available: false },
  { id: "emergency-shower-eyes", label: "Emergency shower / eyes", available: false },
  { id: "aed", label: "AED", available: false },
  { id: "other-medical", label: "Other", available: false },
];

// ── Section 11: Enhanced Sign-off ──────────────────────────────────────
export const DEFAULT_ENHANCED_SIGN_OFF: EnhancedSignOff = {
  ehsSpecialistName: "",
  ehsSpecialistDate: "",
  ehsSpecialistSignature: "",
  managerName: "",
  managerDate: "",
  managerSignature: "",
};
