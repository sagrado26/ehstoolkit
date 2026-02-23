// client/src/features/crane-inspection/types.ts
export type CraneInspectionFormData = {
  inspector: string;
  buddyInspector: string;
  bay: string;
  machine: string;
  date: string;
  q1: "yes" | "no";
  q2: "yes" | "no";
  q3: "yes" | "no";
  status: "draft" | "submitted";
};
