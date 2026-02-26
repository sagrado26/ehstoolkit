import {
  GraduationCap, Beaker, UsersRound, ArrowDownToLine, Shield,
  Lock, HardHat, Ruler, AlertCircle, Brain, Zap,
} from "lucide-react";

export function getRiskColor(score: number) {
  if (score >= 12) return { bg: "bg-red-500", text: "text-white", label: "Extreme", ring: "ring-red-500/20", border: "border-red-200 dark:border-red-500/20" };
  if (score >= 8) return { bg: "bg-orange-500", text: "text-white", label: "High", ring: "ring-orange-500/20", border: "border-orange-200 dark:border-orange-500/20" };
  if (score >= 4) return { bg: "bg-amber-400", text: "text-amber-900", label: "Medium", ring: "ring-amber-400/20", border: "border-amber-200 dark:border-amber-500/20" };
  return { bg: "bg-emerald-500", text: "text-white", label: "Low", ring: "ring-emerald-500/20", border: "border-primary/20" };
}

/** Single source of truth for all pre-task assessment questions */
export const SAFETY_QUESTIONS = [
  {
    key: "q1_specializedTraining",
    label: "Specialized Training",
    hint: "Confined space, QEW, H2, Crane Operator certification",
    icon: GraduationCap,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
    borderColor: "border-violet-200",
    definition: "This task requires workers to have completed specialized training or certification before proceeding. Ensure all personnel have the required qualifications documented.",
  },
  {
    key: "q2_chemicals",
    label: "Chemicals / Hazardous Materials",
    hint: "Task involves chemicals or hazardous substances",
    icon: Beaker,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    definition: "Chemicals or hazardous materials are present or will be used during this task. Appropriate SDS sheets must be reviewed and proper handling procedures followed.",
  },
  {
    key: "q3_impactOthers",
    label: "Other Work in Area",
    hint: "Other work that may impact this task",
    icon: UsersRound,
    color: "text-sky-600",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-200",
    definition: "This task may impact other workers or work activities in the surrounding area. Coordination with adjacent teams and appropriate notifications are required.",
  },
  {
    key: "q4_falls",
    label: "Fall Hazard",
    hint: "Falls of 4 feet (1.2m) or greater",
    icon: ArrowDownToLine,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-200",
    definition: "There is a risk of falls from height during this task. Fall protection systems, guardrails, or other preventive measures must be in place before work begins.",
  },
  {
    key: "q5_barricades",
    label: "Barricades Required",
    hint: "Trip hazards, floor tile removal",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    definition: "Barricades or exclusion zones are required to secure the work area. Ensure proper signage and barriers are installed before commencing work.",
  },
  {
    key: "q6_loto",
    label: "LOTO Required",
    hint: "Lock Out Tag Out procedures",
    icon: Lock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    definition: "Lock Out / Tag Out procedures are required for this task. All energy sources must be isolated and verified before any maintenance or servicing work begins.",
  },
  {
    key: "q7_lifting",
    label: "Heavy Lifting",
    hint: "Items over 35lbs / 15.9kg",
    icon: HardHat,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    definition: "Heavy lifting operations are involved in this task. Mechanical lifting aids, proper techniques, and adequate personnel must be arranged.",
  },
  {
    key: "q8_ergonomics",
    label: "Ergonomic Concerns",
    hint: "Abnormal ergonomic situations",
    icon: Ruler,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    definition: "Ergonomic risk factors are present including repetitive motion, awkward postures, or sustained physical effort. Controls and rest breaks should be planned.",
  },
  {
    key: "q10_headInjury",
    label: "Head Injury Risk",
    hint: "Hard hat requirements",
    icon: Brain,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-200",
    definition: "There is a risk of head injury during this task. Hard hats and appropriate head protection must be worn in the designated work area.",
  },
  {
    key: "q11_otherPPE",
    label: "Additional PPE",
    hint: "Knee pads, cut resistant gloves",
    icon: Zap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
    definition: "Additional Personal Protective Equipment beyond standard requirements is needed for this task. Ensure all specified PPE is available and in good condition.",
  },
  {
    key: "q9_otherConcerns",
    label: "Other Safety Concerns",
    hint: "Additional concerns not listed",
    icon: AlertCircle,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
    definition: "Additional safety concerns have been identified that do not fall into standard categories. Review and address these before proceeding.",
  },
] as const;

/** Derived lookup: key → label (backwards-compatible) */
export const QUESTION_LABELS: Record<string, string> = Object.fromEntries(
  SAFETY_QUESTIONS.map(q => [q.key, q.label])
);

/** Derived list of all question keys (backwards-compatible) */
export const QUESTION_KEYS = SAFETY_QUESTIONS.map(q => q.key);
