import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/name-avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowLeft, AlertTriangle, ShieldCheck, ShieldAlert, Users, History, ClipboardCheck, FileText, GraduationCap, Pencil, ChevronDown, Lock, ArrowDownToLine, HardHat, Zap, Beaker, UsersRound, Ruler, AlertCircle, Brain, Shield, Copy, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHazardInfo } from "../hazard-data";
import { getRiskColor, QUESTION_LABELS } from "../risk-utils";
import type { SafetyPlanFormData } from "../types";

const SAFETY_FLAG_META: Record<string, { icon: any; color: string; bgColor: string; borderColor: string; definition: string }> = {
  q1_specializedTraining: {
    icon: GraduationCap,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
    borderColor: "border-violet-200",
    definition: "This task requires workers to have completed specialized training or certification before proceeding. Ensure all personnel have the required qualifications documented.",
  },
  q2_chemicals: {
    icon: Beaker,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    definition: "Chemicals or hazardous materials are present or will be used during this task. Appropriate SDS sheets must be reviewed and proper handling procedures followed.",
  },
  q3_impactOthers: {
    icon: UsersRound,
    color: "text-sky-600",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-200",
    definition: "This task may impact other workers or work activities in the surrounding area. Coordination with adjacent teams and appropriate notifications are required.",
  },
  q4_falls: {
    icon: ArrowDownToLine,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-200",
    definition: "There is a risk of falls from height during this task. Fall protection systems, guardrails, or other preventive measures must be in place before work begins.",
  },
  q5_barricades: {
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    definition: "Barricades or exclusion zones are required to secure the work area. Ensure proper signage and barriers are installed before commencing work.",
  },
  q6_loto: {
    icon: Lock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    definition: "Lock Out / Tag Out procedures are required for this task. All energy sources must be isolated and verified before any maintenance or servicing work begins.",
  },
  q7_lifting: {
    icon: HardHat,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    definition: "Heavy lifting operations are involved in this task. Mechanical lifting aids, proper techniques, and adequate personnel must be arranged.",
  },
  q8_ergonomics: {
    icon: Ruler,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    definition: "Ergonomic risk factors are present including repetitive motion, awkward postures, or sustained physical effort. Controls and rest breaks should be planned.",
  },
  q9_otherConcerns: {
    icon: AlertCircle,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
    definition: "Additional safety concerns have been identified that do not fall into standard categories. Review and address these before proceeding.",
  },
  q10_headInjury: {
    icon: Brain,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-200",
    definition: "There is a risk of head injury during this task. Hard hats and appropriate head protection must be worn in the designated work area.",
  },
  q11_otherPPE: {
    icon: Zap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
    definition: "Additional Personal Protective Equipment beyond standard requirements is needed for this task. Ensure all specified PPE is available and in good condition.",
  },
};


interface Props {
  plan: SafetyPlanFormData & { id?: number };
  onBack: () => void;
  onEdit?: () => void;
  onReuse?: () => void;
  onViewReusedPlan?: (planId: number) => void;
  currentUser?: string;
}

function formatTimestamp(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function SafetyPlanView({ plan, onBack, onEdit, onReuse, onViewReusedPlan, currentUser }: Props) {
  const [versionOpen, setVersionOpen] = useState(false);
  const [flagDialog, setFlagDialog] = useState<{ key: string; label: string } | null>(null);

  const flagged = Object.entries(QUESTION_LABELS).filter(([key]) => (plan as any)[key] === "yes");
  const cleared = Object.entries(QUESTION_LABELS).filter(([key]) => (plan as any)[key] === "no");

  // Determine if current user is a team member (lead, approver, or engineer)
  const isTeamMember = currentUser ? (
    plan.leadName?.toLowerCase() === currentUser.toLowerCase() ||
    plan.approverName?.toLowerCase() === currentUser.toLowerCase() ||
    plan.engineers.some(e => e.toLowerCase() === currentUser.toLowerCase())
  ) : false;

  const checklistHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresChecklist);
  const ptwHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresPtW);

  const { data: auditLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/audit-logs", { safetyPlanId: plan.id }],
    queryFn: () => fetch(`/api/audit-logs?safetyPlanId=${plan.id}`).then(r => r.json()),
    enabled: !!plan.id,
  });

  const activeFlagMeta = flagDialog ? SAFETY_FLAG_META[flagDialog.key] : null;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {plan.id && (
              <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                ISP-{String(plan.id).padStart(4, "0")}
              </Badge>
            )}
            <h1 className="text-lg font-semibold truncate">{plan.taskName}</h1>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={plan.status === "approved" ? "default" : "secondary"} className="text-[10px]">
              {plan.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{plan.date}</span>
          </div>
        </div>
        {isTeamMember && onEdit && (
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="shrink-0 gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
        {!isTeamMember && onReuse && (
          <Button type="button" variant="outline" size="sm" onClick={onReuse} className="shrink-0 gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Reuse
          </Button>
        )}
      </div>

      {/* ===== FORM BODY ===== */}
      <div className="border border-border rounded-lg bg-card divide-y divide-border">

        {/* Task Details */}
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
            <span><span className="text-muted-foreground text-xs uppercase tracking-wide">Shift:</span> <span className="font-medium">{plan.shift}</span></span>
            <span><span className="text-muted-foreground text-xs uppercase tracking-wide">Location:</span> <span className="font-medium">{plan.location}</span></span>
            <span><span className="text-muted-foreground text-xs uppercase tracking-wide">Machine:</span> <span className="font-medium">{plan.machineNumber || "N/A"}</span></span>
            <span><span className="text-muted-foreground text-xs uppercase tracking-wide">Group:</span> <span className="font-medium">{plan.group}</span></span>
            <span><span className="text-muted-foreground text-xs uppercase tracking-wide">System:</span> <span className="font-medium">{plan.system}</span></span>
          </div>
        </div>

        {/* ===== SAFETY FLAGS ===== */}
        <div className="px-5 py-5">
          {flagged.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-600" />
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  {flagged.length} Safety Concern{flagged.length !== 1 ? "s" : ""} Flagged
                </p>
              </div>

              {/* Icon grid - like second screenshot */}
              <div className="flex flex-wrap gap-3 mb-3">
                {flagged.map(([key, label]) => {
                  const meta = SAFETY_FLAG_META[key];
                  const Icon = meta?.icon || ShieldAlert;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFlagDialog({ key, label })}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <div className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center transition-shadow group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-current/20",
                        meta?.bgColor || "bg-amber-100"
                      )}>
                        <Icon className={cn("h-6 w-6", meta?.color || "text-amber-600")} />
                        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-center leading-tight max-w-[72px] text-muted-foreground group-hover:text-foreground transition-colors">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {cleared.length > 0 && (
                <div className="flex items-center gap-1.5 pt-2">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <p className="text-[11px] text-muted-foreground">{cleared.length} item{cleared.length !== 1 ? "s" : ""} cleared</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-primary">All Safety Checks Cleared</p>
            </div>
          )}
        </div>

        {/* ===== HAZARDS ===== */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Hazards ({plan.hazards.length})</p>
          </div>

          {plan.hazards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hazards identified.</p>
          ) : (
            <div className="space-y-3">
              {plan.hazards.map(name => {
                const a = plan.assessments[name];
                const score = a ? a.severity * a.likelihood : 0;
                const risk = getRiskColor(score);
                const info = getHazardInfo(name);

                return (
                  <div key={name} className={cn("rounded-lg border p-4", risk.border)}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("h-7 min-w-[28px] px-1.5 flex items-center justify-center rounded-md text-[11px] font-bold", risk.bg, risk.text)}>
                          {score}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{name}</p>
                          {info && (
                            <p className="text-[11px] text-muted-foreground/60">e.g. {info.example}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded", risk.bg, risk.text)}>
                          {risk.label}
                        </span>
                        {a && (
                          <span className="text-[10px] text-muted-foreground">S:{a.severity} × L:{a.likelihood}</span>
                        )}
                      </div>
                    </div>

                    {(a?.requiresChecklist || a?.requiresPtW || info?.training) && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {a?.requiresChecklist && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-medium border border-blue-500/20">
                            <ClipboardCheck className="h-3 w-3" /> {a.checklistType || "Checklist Required"}
                          </span>
                        )}
                        {a?.requiresPtW && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-medium border border-amber-500/20">
                            <FileText className="h-3 w-3" /> {a.permitType || "PtW Required"}
                          </span>
                        )}
                        {info?.training && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">
                            <GraduationCap className="h-3 w-3" /> {info.training}
                          </span>
                        )}
                      </div>
                    )}

                    {a?.mitigation ? (
                      <div className="rounded-md bg-primary/5 border border-primary/10 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Mitigation Plan</p>
                        <p className="text-sm text-foreground leading-relaxed">{a.mitigation}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-destructive/70 italic">No mitigation plan provided</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Required documents summary */}
        {(checklistHazards.length > 0 || ptwHazards.length > 0) && (
          <div className="px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checklistHazards.length > 0 && (
                <div className="rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-400">Required Checklists</p>
                  </div>
                  <div className="space-y-1">
                    {checklistHazards.map(name => (
                      <p key={name} className="text-[11px] text-blue-700 dark:text-blue-400/80">
                        {plan.assessments[name]?.checklistType} — {name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {ptwHazards.length > 0 && (
                <div className="rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Linked Permit to Work</p>
                  </div>
                  <div className="space-y-1">
                    {ptwHazards.map(name => (
                      <p key={name} className="text-[11px] text-amber-700 dark:text-amber-400/80">
                        {plan.assessments[name]?.permitType} — {name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== SIGN-OFF ===== */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Sign Off</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2.5">
              <NameAvatar name={plan.leadName} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lead</p>
                <p className="text-sm font-medium">{plan.leadName || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <NameAvatar name={plan.approverName || ""} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Manager</p>
                <p className="text-sm font-medium">{plan.approverName || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Team</p>
              {plan.engineers.length > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {plan.engineers.slice(0, 4).map(name => (
                      <NameAvatar key={name} name={name} className="h-6 w-6 text-[9px] ring-2 ring-background" />
                    ))}
                  </div>
                  {plan.engineers.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{plan.engineers.length - 4}</span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </div>
          {plan.comments && (
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border italic">"{plan.comments}"</p>
          )}
        </div>

        {/* ===== VERSION HISTORY (collapsible) ===== */}
        {plan.id && (
          <div className="px-5">
            <button
              type="button"
              onClick={() => setVersionOpen(v => !v)}
              className="w-full flex items-center gap-2 py-3 text-left group"
            >
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Version History</span>
              <Badge variant="secondary" className="ml-1 text-[9px] px-1.5 py-0">
                v{Math.max(1, (auditLogs as any[]).filter(l => l.action === "edited").length + 1)}.0
              </Badge>
              <ChevronDown className={cn(
                "h-3.5 w-3.5 ml-auto text-muted-foreground transition-transform duration-200",
                versionOpen && "rotate-180"
              )} />
            </button>

            {versionOpen && (
              <div className="pb-4">
                {(auditLogs as any[]).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No audit trail available.</p>
                ) : (
                  <div className="relative pl-5 space-y-3">
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                    {(auditLogs as any[]).map((log: any, idx: number) => {
                      const isLatest = idx === 0;
                      const actionColors: Record<string, string> = {
                        created: "bg-primary",
                        edited: "bg-amber-500",
                        approved: "bg-blue-500",
                        rejected: "bg-red-500",
                        reused: "bg-teal-500",
                      };
                      const reusedPlanId = log.action === "reused" && log.changes?.reusedAsId
                        ? log.changes.reusedAsId
                        : null;
                      return (
                        <div key={log.id} className="relative">
                          <div className={cn(
                            "absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                            actionColors[log.action] || "bg-muted-foreground"
                          )} />
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium capitalize">{log.action}</span>
                                {isLatest && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Latest</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                by {log.performedBy}
                                {log.previousStatus && log.newStatus && log.previousStatus !== log.newStatus && (
                                  <span> &middot; {log.previousStatus} &rarr; {log.newStatus}</span>
                                )}
                              </p>
                              {log.comments && (
                                <p className="text-xs text-muted-foreground mt-1 italic">"{log.comments}"</p>
                              )}
                              {reusedPlanId && (
                                <button
                                  type="button"
                                  onClick={() => onViewReusedPlan?.(reusedPlanId)}
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline cursor-pointer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View new entry (ISP-{String(reusedPlanId).padStart(4, "0")})
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                              {formatTimestamp(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== SAFETY FLAG DIALOG ===== */}
      <Dialog open={!!flagDialog} onOpenChange={(open) => !open && setFlagDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              {activeFlagMeta && (
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", activeFlagMeta.bgColor)}>
                  <activeFlagMeta.icon className={cn("h-5 w-5", activeFlagMeta.color)} />
                </div>
              )}
              <DialogTitle className="text-base">{flagDialog?.label}</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              {activeFlagMeta?.definition || "Details for this safety flag will be provided."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
