import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SRBPreQuestions } from "../types";

interface Props {
  values: SRBPreQuestions;
  onChange: (field: keyof SRBPreQuestions, value: string) => void;
}

const TEXT_QUESTIONS: { key: keyof SRBPreQuestions; label: string; placeholder: string }[] = [
  { key: "reasonForEscalation", label: "1. What is the reason for escalating to SRB?", placeholder: "Describe why this task requires a Safety Review Board..." },
  { key: "procedureOrCondition", label: "2. Which procedure, step, or condition is driving the safety concern?", placeholder: "Identify the specific procedure or condition..." },
  { key: "serviceOrderNumber", label: "3. What is the SRB Service Order Number?", placeholder: "e.g. SO-2026-00451" },
];

const RADIO_QUESTIONS: { key: keyof SRBPreQuestions; label: string }[] = [
  { key: "coachUpdateNeeded", label: "4. Is a coach update needed?" },
  { key: "customerSafetyCompleted", label: "5. Is the customer safety process completed?" },
];

export function SRBPreQuestionsStep({ values, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm font-semibold text-amber-800">Pre-SRB Justification</p>
        <p className="text-xs text-amber-700/70 mt-1">All five questions below must be answered before the hazard reassessment can begin.</p>
      </div>

      {TEXT_QUESTIONS.map((q) => (
        <div key={q.key} className="space-y-2">
          <Label className="text-sm font-medium">{q.label} <span className="text-destructive">*</span></Label>
          <Textarea
            value={values[q.key]}
            onChange={(e) => onChange(q.key, e.target.value)}
            placeholder={q.placeholder}
            rows={q.key === "serviceOrderNumber" ? 1 : 3}
            className="text-sm"
          />
        </div>
      ))}

      {RADIO_QUESTIONS.map((q) => (
        <div key={q.key} className="space-y-2">
          <Label className="text-sm font-medium">{q.label} <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={values[q.key]}
            onValueChange={(v) => onChange(q.key, v)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id={`${q.key}-yes`} />
              <Label htmlFor={`${q.key}-yes`} className="text-sm cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id={`${q.key}-no`} />
              <Label htmlFor={`${q.key}-no`} className="text-sm cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
