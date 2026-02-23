export type SafetyPlanStep = 1 | 2 | 3 | 4;

export type HazardAssessment = {
  severity: number;   // 1-4
  likelihood: number; // 1-4
  mitigation: string;
  requiresChecklist: boolean;
  checklistType: string;
  requiresPtW: boolean;
  permitType: string;
};

export type SafetyPlanFormData = {
  // Step 1
  group: string;
  taskName: string;
  date: string;
  location: string;
  shift: string;
  machineNumber: string;
  region: string;
  system: string;
  canSocialDistance: "yes" | "no";
  // Step 2
  q1_specializedTraining: "yes" | "no";
  q2_chemicals: "yes" | "no";
  q3_impactOthers: "yes" | "no";
  q4_falls: "yes" | "no";
  q5_barricades: "yes" | "no";
  q6_loto: "yes" | "no";
  q7_lifting: "yes" | "no";
  q8_ergonomics: "yes" | "no";
  q9_otherConcerns: "yes" | "no";
  q10_headInjury: "yes" | "no";
  q11_otherPPE: "yes" | "no";
  // Step 3
  hazards: string[];
  assessments: Record<string, HazardAssessment>;
  // Linked Permit to Work
  linkedPermitId?: number;
  // Step 4
  leadName: string;
  approverName?: string;
  engineers: string[];
  comments?: string;
  status: "draft" | "pending" | "approved";
};
