// client/src/features/incidents/types.ts
export type IncidentFormData = {
  date: string;
  type: "near-miss" | "injury" | "property-damage" | "environmental";
  location: string;
  description: string;
  severity: 1 | 2 | 3 | 4;
  assignedInvestigator: string;
  status: "open" | "investigating" | "closed";
};
