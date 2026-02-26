import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HazardModal } from "./HazardModal";
import { HAZARD_CATALOG, getHazardInfo } from "../hazard-data";
import type { HazardAssessment } from "../types";
import { AlertTriangle, Pencil, ClipboardCheck, FileText, GraduationCap, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getRiskColor } from "../risk-utils";

const RISK_BANDS = [
  { label: "Low", range: "1–3", score: 2, description: "Monitor & proceed" },
  { label: "Medium", range: "4–7", score: 5, description: "Controls required" },
  { label: "High", range: "8–11", score: 9, description: "Senior approval needed" },
  { label: "Extreme", range: "12–16", score: 13, description: "Stop work — escalate" },
] as const;

function RiskMatrixLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-border bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Risk Matrix Guide
          </span>
          <span className="text-[10px] text-muted-foreground/60">Score = Severity × Likelihood (1–4 each)</span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/50 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RISK_BANDS.map(band => {
            const risk = getRiskColor(band.score);
            return (
              <div key={band.label} className={cn("rounded-md p-2.5 border", risk.border)}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn("h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0", risk.bg, risk.text)}>
                    {band.range}
                  </span>
                  <span className="text-xs font-semibold">{band.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{band.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Props {
  hazards: string[];
  assessments: Record<string, HazardAssessment>;
  onHazardsChange: (hazards: string[], assessments: Record<string, HazardAssessment>) => void;
}

export function HazardIDStep({ hazards, assessments, onHazardsChange }: Props) {
  const [editingHazard, setEditingHazard] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (!value || hazards.includes(value)) return;
    const info = getHazardInfo(value);
    const newHazards = [...hazards, value];
    const newAssessments = {
      ...assessments,
      [value]: {
        severity: 1,
        likelihood: 1,
        mitigation: "",
        requiresChecklist: info?.checklistRequired ?? false,
        checklistType: info?.checklistType ?? "",
        requiresPtW: info?.permitRequired ?? false,
        permitType: info?.permitType ?? "",
      },
    };
    onHazardsChange(newHazards, newAssessments);
    setEditingHazard(value);
  };

  const removeHazard = (name: string) => {
    const newAssessments = { ...assessments };
    delete newAssessments[name];
    onHazardsChange(hazards.filter(h => h !== name), newAssessments);
  };

  const saveAssessment = (name: string, assessment: HazardAssessment) => {
    onHazardsChange(hazards, {
      ...assessments,
      [name]: assessment,
    });
  };

  return (
    <div className="space-y-3">
      {hazards.length > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary inline-block">
          {hazards.length} identified
        </span>
      )}

      {/* Risk matrix legend */}
      <RiskMatrixLegend />

      {/* Select — full width */}
      <Select value="" onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a hazard..." />
        </SelectTrigger>
        <SelectContent>
          {HAZARD_CATALOG.filter(h => !hazards.includes(h.name)).map(h => (
            <SelectItem key={h.name} value={h.name}>
              <div className="flex items-center gap-2">
                <span>{h.name}</span>
                {h.checklistRequired && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">Checklist</span>
                )}
                {h.permitRequired && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">PtW</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Empty state */}
      {hazards.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border py-10 text-center">
          <AlertTriangle className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No hazards identified yet.</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Select a hazard from the dropdown to begin.</p>
        </div>
      )}

      {/* Hazard list */}
      {hazards.length > 0 && (
        <TooltipProvider delayDuration={200}>
          <div className="rounded-lg border border-border overflow-hidden">
            {hazards.map(name => {
              const a = assessments[name] || { severity: 1, likelihood: 1, mitigation: "", requiresChecklist: false, checklistType: "", requiresPtW: false, permitType: "" };
              const score = a.severity * a.likelihood;
              const risk = getRiskColor(score);
              const info = getHazardInfo(name);

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEditingHazard(name)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border last:border-0"
                >
                  {/* Left: risk score + label only */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5 w-12">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold",
                      risk.bg, risk.text
                    )}>
                      {score}
                    </span>
                    <span className={cn("text-[9px] font-semibold uppercase mt-1", score >= 8 ? "text-red-600" : score >= 4 ? "text-amber-600" : "text-emerald-600")}>
                      {risk.label}
                    </span>
                  </div>

                  {/* Middle: name + example + badges + mitigation */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{name}</p>
                    {info?.example && (
                      <p className="text-[11px] text-muted-foreground/60 italic">e.g. {info.example}</p>
                    )}

                    {/* Requirement badges — training as tooltip on checklist */}
                    {(a.requiresChecklist || a.requiresPtW || info?.training) && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {a.requiresChecklist && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-medium">
                            <ClipboardCheck className="h-3 w-3" /> {a.checklistType || "Checklist Required"}
                            {info?.training && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <GraduationCap className="h-3 w-3 ml-0.5 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs max-w-[200px]">
                                  Training: {info.training}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </span>
                        )}
                        {!a.requiresChecklist && info?.training && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 cursor-help">
                                <GraduationCap className="h-3 w-3" /> {info.training}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">Training required</TooltipContent>
                          </Tooltip>
                        )}
                        {a.requiresPtW && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-medium">
                            <FileText className="h-3 w-3" /> {a.permitType || "PtW Required"}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Mitigation display */}
                    {a.mitigation && (
                      <div className="mt-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Mitigation</p>
                        <p className="text-[11px] text-muted-foreground">{a.mitigation}</p>
                      </div>
                    )}
                    {!a.mitigation && (
                      <p className="text-[11px] text-muted-foreground/50 mt-1 italic">Tap to assess this hazard</p>
                    )}
                  </div>

                  {/* Right: edit icon */}
                  <div className="shrink-0 mt-1">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </div>
                </button>
              );
            })}
          </div>
        </TooltipProvider>
      )}

      {/* Hazard assessment modal */}
      {editingHazard && (
        <HazardModal
          open={!!editingHazard}
          onOpenChange={(open) => { if (!open) setEditingHazard(null); }}
          hazardName={editingHazard}
          assessment={assessments[editingHazard] || { severity: 1, likelihood: 1, mitigation: "", requiresChecklist: false, checklistType: "", requiresPtW: false, permitType: "" }}
          onSave={(assessment) => saveAssessment(editingHazard, assessment)}
          onRemove={() => removeHazard(editingHazard)}
        />
      )}
    </div>
  );
}
