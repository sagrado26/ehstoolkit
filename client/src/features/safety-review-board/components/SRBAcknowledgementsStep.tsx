import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { SRBAcknowledgements } from "../types";

interface Props {
  values: SRBAcknowledgements;
  onChange: (field: keyof SRBAcknowledgements, value: boolean) => void;
}

const QUESTIONS: { key: keyof SRBAcknowledgements; label: string }[] = [
  { key: "ack1_hazardReEvaluated", label: "Has the hazard been fully re-evaluated?" },
  { key: "ack2_participantsReviewed", label: "Have all SRB participants reviewed the new mitigations?" },
  { key: "ack3_controlsValidated", label: "Has the team validated that the new control measures are workable?" },
  { key: "ack4_residualRiskAgreed", label: "Has the team discussed and agreed on the residual risk?" },
  { key: "ack5_safeActionAcknowledged", label: "Have all parties acknowledged the new safe plan of action?" },
  { key: "ack6_newRiskAcceptable", label: "Is the new hazard value (Severity, Likelihood, Risk) acceptable and at LOW?" },
];

export function SRBAcknowledgementsStep({ values, onChange }: Props) {
  const allChecked = Object.values(values).every(Boolean);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm font-semibold text-blue-800">Post-Mitigation Acknowledgement</p>
        <p className="text-xs text-blue-700/70 mt-1">All six questions must be acknowledged before sign-off can proceed. None may be left blank.</p>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q, i) => (
          <label
            key={q.key}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              values[q.key]
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-border bg-card hover:bg-muted/30"
            )}
          >
            <Checkbox
              checked={values[q.key]}
              onCheckedChange={(checked) => onChange(q.key, checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span className="text-sm font-medium">{i + 1}. {q.label}</span>
            </div>
            {values[q.key] && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
          </label>
        ))}
      </div>

      {allChecked && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
          <p className="text-xs font-semibold text-emerald-700">All acknowledgements confirmed. Proceed to signatures.</p>
        </div>
      )}
    </div>
  );
}
