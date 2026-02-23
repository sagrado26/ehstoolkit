import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2, ShieldCheck, ClipboardCheck, FileText, GraduationCap } from "lucide-react";
import { getHazardInfo } from "../hazard-data";
import { getRiskColor } from "../risk-utils";
import type { HazardAssessment } from "../types";

const SEVERITY_LABELS = ["", "Negligible", "Minor", "Major", "Catastrophic"];
const LIKELIHOOD_LABELS = ["", "Unlikely", "Possible", "Likely", "Almost Certain"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hazardName: string;
  assessment: HazardAssessment;
  onSave: (assessment: HazardAssessment) => void;
  onRemove: () => void;
}

export function HazardModal({ open, onOpenChange, hazardName, assessment, onSave, onRemove }: Props) {
  const [severity, setSeverity] = useState(assessment.severity);
  const [likelihood, setLikelihood] = useState(assessment.likelihood);
  const [mitigation, setMitigation] = useState(assessment.mitigation);

  const info = getHazardInfo(hazardName);

  useEffect(() => {
    setSeverity(assessment.severity);
    setLikelihood(assessment.likelihood);
    setMitigation(assessment.mitigation);
  }, [assessment, open]);

  const score = severity * likelihood;
  const risk = getRiskColor(score);

  const handleSave = () => {
    onSave({
      severity,
      likelihood,
      mitigation,
      requiresChecklist: info?.checklistRequired ?? assessment.requiresChecklist,
      checklistType: info?.checklistType ?? assessment.checklistType,
      requiresPtW: info?.permitRequired ?? assessment.requiresPtW,
      permitType: info?.permitType ?? assessment.permitType,
    });
    onOpenChange(false);
  };

  const handleRemove = () => {
    onRemove();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
        {/* Compact header with risk indicator */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <DialogHeader className="flex-row items-center gap-2.5 space-y-0">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <DialogTitle className="text-sm font-semibold">{hazardName}</DialogTitle>
          </DialogHeader>
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-2 text-xs font-bold", risk.bg, risk.text, risk.ring)}>
            {score} <span className="font-medium text-[10px] opacity-80">{risk.label}</span>
          </div>
        </div>

        <div className="px-5 pb-4 space-y-3">
          {/* Training + example hint */}
          {info && (
            <div className="text-[11px] text-muted-foreground bg-muted/50 rounded-md px-3 py-2 space-y-0.5">
              <p>e.g. {info.example}</p>
              {info.training && (
                <p className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> Training: {info.training}
                </p>
              )}
            </div>
          )}

          {/* Auto-requirement badges (read-only) */}
          {(info?.checklistRequired || info?.permitRequired) && (
            <div className="flex flex-wrap gap-2">
              {info?.checklistRequired && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-medium border border-blue-500/20">
                  <ClipboardCheck className="h-3.5 w-3.5" /> {info.checklistType}
                </span>
              )}
              {info?.permitRequired && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 text-[11px] font-medium border border-amber-500/20">
                  <FileText className="h-3.5 w-3.5" /> {info.permitType}
                </span>
              )}
            </div>
          )}

          {/* Severity + Likelihood — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Severity</p>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSeverity(v)}
                    className={cn(
                      "h-8 rounded text-xs font-semibold transition-all",
                      severity === v
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-center">{SEVERITY_LABELS[severity]}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Likelihood</p>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLikelihood(v)}
                    className={cn(
                      "h-8 rounded text-xs font-semibold transition-all",
                      likelihood === v
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-center">{LIKELIHOOD_LABELS[likelihood]}</p>
            </div>
          </div>

          {/* Mitigation — the key input */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mitigation Plan</p>
            </div>
            <Textarea
              rows={2}
              value={mitigation}
              onChange={e => setMitigation(e.target.value)}
              placeholder="Describe the controls and mitigation measures..."
              className="text-sm resize-none"
            />
            {!mitigation.trim() && (
              <p className="text-[10px] text-destructive mt-1">Mitigation plan is required before saving.</p>
            )}
          </div>

          {/* Actions — tight bottom row */}
          <div className="flex justify-between items-center pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2">
              <Trash2 className="h-3 w-3" /> Remove
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={!mitigation.trim()} className="h-8 px-4 text-xs">
              Save Assessment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
