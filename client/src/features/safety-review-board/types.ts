import type { Assessment, SRBPreQuestions, SRBHazardReassessment, SRBAcknowledgements, SRBSignatory } from "@shared/schema";

export type SRBStep = 1 | 2 | 3 | 4 | 5 | 6;

export type { SRBPreQuestions, SRBHazardReassessment, SRBAcknowledgements, SRBSignatory };

export type SRBFormData = {
  safetyPlanId: number;
  status: "draft" | "in-progress" | "completed" | "rejected";
  serviceOrderNumber: string;
  preQuestions: SRBPreQuestions;
  escalatedHazards: string[];
  originalAssessments: Record<string, Assessment>;
  reassessments: SRBHazardReassessment[];
  teamMembers: string[];
  acknowledgements: SRBAcknowledgements;
  signatories: SRBSignatory[];
};

export type SRBLaunchContext = {
  safetyPlanId: number;
  taskName: string;
  leadName: string;
  engineers: string[];
  hazards: string[];
  assessments: Record<string, Assessment>;
};

export const DEFAULT_PRE_QUESTIONS: SRBPreQuestions = {
  reasonForEscalation: "",
  procedureOrCondition: "",
  serviceOrderNumber: "",
  coachUpdateNeeded: "no",
  customerSafetyCompleted: "no",
};

export const DEFAULT_ACKNOWLEDGEMENTS: SRBAcknowledgements = {
  ack1_hazardReEvaluated: false,
  ack2_participantsReviewed: false,
  ack3_controlsValidated: false,
  ack4_residualRiskAgreed: false,
  ack5_safeActionAcknowledged: false,
  ack6_newRiskAcceptable: false,
};

export const DEFAULT_SIGNATORIES: SRBSignatory[] = [
  { role: "EHS Specialist", name: "", signatureData: null, signedAt: null },
  { role: "Fab Team Lead", name: "", signatureData: null, signedAt: null },
  { role: "CS Management", name: "", signatureData: null, signedAt: null },
];

export const DEFAULT_FORM_DATA: SRBFormData = {
  safetyPlanId: 0,
  status: "draft",
  serviceOrderNumber: "",
  preQuestions: DEFAULT_PRE_QUESTIONS,
  escalatedHazards: [],
  originalAssessments: {},
  reassessments: [],
  teamMembers: [],
  acknowledgements: DEFAULT_ACKNOWLEDGEMENTS,
  signatories: [...DEFAULT_SIGNATORIES],
};
