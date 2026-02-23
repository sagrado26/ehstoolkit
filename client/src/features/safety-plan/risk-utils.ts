export function getRiskColor(score: number) {
  if (score >= 12) return { bg: "bg-red-500", text: "text-white", label: "Extreme", ring: "ring-red-500/20", border: "border-red-200 dark:border-red-500/20" };
  if (score >= 8) return { bg: "bg-orange-500", text: "text-white", label: "High", ring: "ring-orange-500/20", border: "border-orange-200 dark:border-orange-500/20" };
  if (score >= 4) return { bg: "bg-amber-400", text: "text-amber-900", label: "Medium", ring: "ring-amber-400/20", border: "border-amber-200 dark:border-amber-500/20" };
  return { bg: "bg-emerald-500", text: "text-white", label: "Low", ring: "ring-emerald-500/20", border: "border-primary/20" };
}

export const QUESTION_LABELS: Record<string, string> = {
  q1_specializedTraining: "Specialized Training",
  q2_chemicals: "Chemicals / Hazardous Materials",
  q3_impactOthers: "Other Work in Area",
  q4_falls: "Fall Hazard",
  q5_barricades: "Barricades Required",
  q6_loto: "LOTO Required",
  q7_lifting: "Heavy Lifting",
  q8_ergonomics: "Ergonomic Concerns",
  q9_otherConcerns: "Other Safety Concerns",
  q10_headInjury: "Head Injury Risk",
  q11_otherPPE: "Additional PPE",
};

export const QUESTION_KEYS = Object.keys(QUESTION_LABELS);
