import { SRBReassessmentCard } from "./SRBReassessmentCard";
import type { SRBHazardReassessment } from "../types";

interface Props {
  reassessments: SRBHazardReassessment[];
  onChange: (reassessments: SRBHazardReassessment[]) => void;
}

export function SRBReassessmentStep({ reassessments, onChange }: Props) {
  const handleUpdate = (index: number, updated: SRBHazardReassessment) => {
    const next = [...reassessments];
    next[index] = updated;
    onChange(next);
  };

  const allLow = reassessments.every(r => r.newSeverity * r.newLikelihood <= 3);
  const allFilled = reassessments.every(r => r.additionalSafetyMeasures.trim() !== "" && r.mitigationPlan.trim() !== "");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">
          Reassess each escalated hazard below. All risks must reach <strong>LOW (score 1-3)</strong> with documented mitigation before proceeding.
        </p>
      </div>

      {reassessments.map((r, i) => (
        <SRBReassessmentCard
          key={r.hazardName}
          reassessment={r}
          onChange={(updated) => handleUpdate(i, updated)}
        />
      ))}

      {!allLow && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
          <p className="text-xs font-semibold text-red-700">One or more hazards still above LOW. Adjust severity/likelihood or add stronger mitigations.</p>
        </div>
      )}

      {allLow && !allFilled && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-xs font-semibold text-amber-700">Please fill in all safety measures and mitigation plans before proceeding.</p>
        </div>
      )}

      {allLow && allFilled && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
          <p className="text-xs font-semibold text-emerald-700">All hazards reduced to LOW. You may proceed to acknowledgements.</p>
        </div>
      )}
    </div>
  );
}
