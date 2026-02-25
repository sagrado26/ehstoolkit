export type PermitTab = "details" | "precautions" | "type-specific" | "srb" | "authority";
export type PermitTypeId = "confined-space" | "hazardous-space" | "hazardous-chemicals";

export type PermitFormData = {
  date: string;
  submitter: string;
  manager: string;
  location: string;
  workType: "Hot Work" | "Cold Work" | "Electrical" | "Working at Height" | "Confined Space" | "Mechanical";
  permitType: PermitTypeId | "general";
  workDescription: string;
  spq1: "yes" | "no";
  spq2: "yes" | "no";
  spq3: "yes" | "no";
  spq4: "yes" | "no";
  spq5: "yes" | "no";
  authorityName: string;
  status: "draft" | "pending" | "approved";
  // Confined Space
  o2Level: string;
  nitrogenPurge: string;
  entrySupervisor: string;
  standbyPerson: string;
  // Hazardous Space
  hazardAssessment: string;
  respiratoryProtection: string;
  isolationMethods: string;
  // Hazardous Chemicals
  chemicalInventory: string;
  sdsDocuments: string;
  ppeRequirements: string;
  containmentPlan: string;
  // SRB
  srbRequired: string;
  srbPrimaryRoute: string;
  srbSecondaryRoute: string;
  srbAssemblyPoint: string;
  srbEmergencyContact: string;
};
