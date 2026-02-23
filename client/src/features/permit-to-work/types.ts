export type PermitTab = "details" | "precautions" | "authority";

export type PermitFormData = {
  date: string;
  submitter: string;
  manager: string;
  location: string;
  workType: "Hot Work" | "Cold Work" | "Electrical" | "Working at Height" | "Confined Space" | "Mechanical";
  workDescription: string;
  spq1: "yes" | "no";
  spq2: "yes" | "no";
  spq3: "yes" | "no";
  spq4: "yes" | "no";
  spq5: "yes" | "no";
  authorityName: string;
  status: "draft" | "pending" | "approved";
};
