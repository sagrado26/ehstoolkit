import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { NameAvatar } from "@/components/ui/name-avatar";
import { getHazardInfo } from "../hazard-data";
import { getRiskColor, QUESTION_LABELS } from "../risk-utils";
import type { SafetyPlanFormData } from "../types";
import { ShieldAlert, ShieldCheck, AlertTriangle, ClipboardCheck, FileText, Users, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SafetyPlanFormData;
}

export function PreviewModal({ open, onOpenChange, data }: Props) {
  const flaggedQuestions = Object.entries(QUESTION_LABELS)
    .filter(([key]) => (data as any)[key] === "yes")
    .map(([, label]) => label);

  const clearedCount = Object.keys(QUESTION_LABELS).length - flaggedQuestions.length;

  const checklistHazards = data.hazards.filter(name => data.assessments[name]?.requiresChecklist);
  const ptwHazards = data.hazards.filter(name => data.assessments[name]?.requiresPtW);
  const needsChecklist = checklistHazards.length > 0;
  const needsPtW = ptwHazards.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0">
        {/* Header card */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">{data.taskName || "Untitled Plan"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {data.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {data.shift || "—"}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {data.location || "—"}</span>
            {data.machineNumber && <span>Machine: {data.machineNumber}</span>}
          </div>
          <div className="flex gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{data.system}</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{data.group}</span>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Safety checks */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              {flaggedQuestions.length > 0 ? (
                <ShieldAlert className="h-4 w-4 text-amber-600" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-primary" />
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Safety Checks
              </p>
            </div>
            {flaggedQuestions.length > 0 ? (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-3.5">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-2">
                  {flaggedQuestions.length} concern{flaggedQuestions.length !== 1 ? "s" : ""} flagged
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {flaggedQuestions.map(label => (
                    <span key={label} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-primary/5 border border-primary/15 p-3.5 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-primary">All safety checks cleared</p>
              </div>
            )}
          </div>

          {/* Hazards — emphasized cards */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hazards ({data.hazards.length})
              </p>
            </div>
            {data.hazards.length > 0 ? (
              <div className="space-y-2.5">
                {data.hazards.map(name => {
                  const a = data.assessments[name];
                  const score = a ? a.severity * a.likelihood : 0;
                  const risk = getRiskColor(score);
                  const info = getHazardInfo(name);
                  return (
                    <div key={name} className={cn("rounded-lg border-l-[3px] border border-border bg-card p-3.5 shadow-sm", risk.border, "border-l-current")} style={{ borderLeftColor: `hsl(var(--primary))` }}>
                      <div className="flex items-start gap-3">
                        <span className={cn("h-8 min-w-[32px] px-1.5 flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-0.5", risk.bg, risk.text)}>
                          {score}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold">{name}</p>
                            <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0", risk.bg, risk.text)}>
                              {getRiskColor(score).label}
                            </span>
                          </div>
                          {/* Badges */}
                          {(a?.requiresChecklist || a?.requiresPtW) && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {a?.requiresChecklist && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[9px] font-medium">
                                  <ClipboardCheck className="h-2.5 w-2.5" /> {a.checklistType}
                                </span>
                              )}
                              {a?.requiresPtW && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[9px] font-medium">
                                  <FileText className="h-2.5 w-2.5" /> {a.permitType}
                                </span>
                              )}
                            </div>
                          )}
                          {/* Mitigation */}
                          {a?.mitigation && (
                            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                              <span className="font-medium text-foreground/70">Mitigation:</span> {a.mitigation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No hazards identified</p>
            )}
          </div>

          {/* Required documents */}
          {(needsChecklist || needsPtW) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Required Documents</p>
              <div className="space-y-2">
                {needsChecklist && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 px-3.5 py-2.5">
                    <ClipboardCheck className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800 dark:text-blue-400">Link to Checklist</p>
                      <p className="text-[10px] text-blue-700/70 dark:text-blue-400/60">
                        {checklistHazards.map(name => data.assessments[name]?.checklistType).filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {needsPtW && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 px-3.5 py-2.5">
                    <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Link to Permit to Work (PtW)</p>
                      <p className="text-[10px] text-amber-700/70 dark:text-amber-400/60">
                        Required for: {ptwHazards.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sign off */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sign Off</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Lead</p>
                <div className="flex items-center gap-2">
                  <NameAvatar name={data.leadName} />
                  <p className="text-sm font-medium">{data.leadName || "—"}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Manager</p>
                <div className="flex items-center gap-2">
                  <NameAvatar name={data.approverName || ""} />
                  <p className="text-sm font-medium">{data.approverName || "—"}</p>
                </div>
              </div>
            </div>
            {data.engineers.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-1.5">
                  {data.engineers.slice(0, 4).map(name => (
                    <NameAvatar key={name} name={name} className="h-6 w-6 text-[9px] ring-2 ring-background" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.engineers.length} team member{data.engineers.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
            {data.comments && (
              <p className="text-xs text-muted-foreground italic mt-2.5 pl-1 border-l-2 border-border">"{data.comments}"</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
