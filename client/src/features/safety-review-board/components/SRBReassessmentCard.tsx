import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getRiskColor } from "@/features/safety-plan/risk-utils";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import type { SRBHazardReassessment } from "../types";

const SEVERITY_LABELS = ["", "Negligible", "Minor", "Major", "Catastrophic"];
const LIKELIHOOD_LABELS = ["", "Unlikely", "Possible", "Likely", "Almost Certain"];

interface Props {
  reassessment: SRBHazardReassessment;
  onChange: (updated: SRBHazardReassessment) => void;
}

export function SRBReassessmentCard({ reassessment, onChange }: Props) {
  const origScore = reassessment.originalRiskScore;
  const origRisk = getRiskColor(origScore);
  const newScore = reassessment.newSeverity * reassessment.newLikelihood;
  const newRisk = getRiskColor(newScore);
  const isLow = newScore <= 3;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        isLow ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
      )}>
        <div className="flex items-center gap-3">
          {isLow ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <div>
            <h4 className="text-sm font-bold">{reassessment.hazardName}</h4>
            <p className={cn("text-xs font-medium", isLow ? "text-emerald-700" : "text-red-700")}>
              {isLow ? "LOW — Acceptable" : "Still too high — must reach LOW"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold", origRisk.bg, origRisk.text)}>
            {origScore}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className={cn("h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold", newRisk.bg, newRisk.text)}>
            {newScore}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Left: Original values (read-only) */}
        <div className="p-4 bg-muted/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Original Assessment</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severity</span>
              <span className="font-medium">{SEVERITY_LABELS[reassessment.originalSeverity]} ({reassessment.originalSeverity})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Likelihood</span>
              <span className="font-medium">{LIKELIHOOD_LABELS[reassessment.originalLikelihood]} ({reassessment.originalLikelihood})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Score</span>
              <Badge variant="outline" className={cn("text-xs", origRisk.border)}>{origRisk.label} ({origScore})</Badge>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Original Mitigation</p>
              <p className="text-xs leading-relaxed">{reassessment.originalMitigation || "None specified"}</p>
            </div>
          </div>
        </div>

        {/* Right: New assessment (editable) */}
        <div className="p-4 space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand mb-1">SRB Reassessment</p>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Additional Safety Measures <span className="text-destructive">*</span></Label>
            <Textarea
              value={reassessment.additionalSafetyMeasures}
              onChange={(e) => onChange({ ...reassessment, additionalSafetyMeasures: e.target.value })}
              placeholder="Describe additional controls beyond original plan..."
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">New Mitigation Plan <span className="text-destructive">*</span></Label>
            <Textarea
              value={reassessment.mitigationPlan}
              onChange={(e) => onChange({ ...reassessment, mitigationPlan: e.target.value })}
              placeholder="Specific, actionable mitigation steps..."
              rows={2}
              className="text-sm"
            />
          </div>

          {/* Severity picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">New Severity</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ ...reassessment, newSeverity: v })}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all border",
                    reassessment.newSeverity === v
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">{SEVERITY_LABELS[reassessment.newSeverity]}</p>
          </div>

          {/* Likelihood picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">New Likelihood</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ ...reassessment, newLikelihood: v })}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all border",
                    reassessment.newLikelihood === v
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">{LIKELIHOOD_LABELS[reassessment.newLikelihood]}</p>
          </div>

          {/* New risk result */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs font-medium">New Risk Score</span>
            <Badge className={cn("text-xs", newRisk.bg, newRisk.text)}>{newRisk.label} ({newScore})</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
