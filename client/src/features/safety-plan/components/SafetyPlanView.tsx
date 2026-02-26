import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/name-avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Pencil, Copy, Calendar, ShieldCheck, ShieldAlert,
  ClipboardCheck, FileText, History, ChevronDown, ExternalLink, Printer,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHazardInfo } from "../hazard-data";
import { SAFETY_QUESTIONS, QUESTION_LABELS } from "../risk-utils";
import type { SafetyPlanFormData } from "../types";
import SafetyPlanDetail from "@/components/SafetyPlanDetail";

/** Derived lookup from shared SAFETY_QUESTIONS for view metadata */
const SAFETY_FLAG_META: Record<string, { icon: any; color: string; bgColor: string; borderColor: string; definition: string }> = Object.fromEntries(
  SAFETY_QUESTIONS.map(q => [q.key, { icon: q.icon, color: q.color, bgColor: q.bgColor, borderColor: q.borderColor, definition: q.definition }])
);

function formatTimestamp(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  plan: SafetyPlanFormData & { id?: number };
  onBack: () => void;
  onEdit?: () => void;
  onReuse?: () => void;
  onStartSRB?: () => void;
  onViewReusedPlan?: (planId: number) => void;
  currentUser?: string;
}

export function SafetyPlanView({ plan, onBack, onEdit, onReuse, onStartSRB, onViewReusedPlan, currentUser }: Props) {
  const [versionOpen, setVersionOpen] = useState(false);
  const [flagDialog, setFlagDialog] = useState<{ key: string; label: string } | null>(null);

  const isTeamMember = currentUser ? (
    plan.leadName?.toLowerCase() === currentUser.toLowerCase() ||
    plan.approverName?.toLowerCase() === currentUser.toLowerCase() ||
    plan.engineers.some(e => e.toLowerCase() === currentUser.toLowerCase())
  ) : false;

  // Map safety concerns with per-flag icons
  const safetyConcerns = Object.entries(QUESTION_LABELS)
    .filter(([key]) => (plan as any)[key] === "yes")
    .map(([key, label]) => {
      const meta = SAFETY_FLAG_META[key];
      const Icon = meta?.icon || ShieldCheck;
      return {
        id: key,
        title: label,
        icon: <Icon className="w-3.5 h-3.5" />,
        color: meta?.color || "text-teal-600",
        definition: meta?.definition,
      };
    });

  const cleared = Object.entries(QUESTION_LABELS).filter(([key]) => (plan as any)[key] === "no");

  // Map hazards with full assessment data
  const hazards = plan.hazards.map((name, idx) => {
    const assessment = plan.assessments[name];
    const severity = assessment?.severity || 0;
    const likelihood = assessment?.likelihood || 0;
    const riskScore = severity * likelihood;
    const info = getHazardInfo(name);

    let riskLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK' = 'LOW RISK';
    if (riskScore >= 9) riskLevel = 'HIGH RISK';
    else if (riskScore >= 4) riskLevel = 'MEDIUM RISK';

    const tags: string[] = [];
    if (assessment?.requiresChecklist) tags.push(assessment.checklistType || "Checklist Required");
    if (assessment?.requiresPtW) tags.push(assessment.permitType || "PtW Required");
    if (info?.training) tags.push(info.training);

    return {
      id: String(idx),
      title: name,
      riskLevel,
      riskScore,
      severity,
      likelihood,
      tags,
      mitigationPlan: assessment?.mitigation || "Follow site safety guidelines.",
    };
  });

  // Required documents
  const checklistHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresChecklist);
  const ptwHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresPtW);

  // Map sign-offs including engineers
  const signOffs = [
    {
      id: "lead",
      role: "Team Lead",
      description: "I confirm that I have reviewed the safety assessment and agree with the hazard mitigations as team lead.",
      name: plan.leadName || "Pending",
      date: plan.status === "approved" ? plan.date : undefined,
    },
    {
      id: "approver",
      role: "Approver",
      description: "I confirm that I have reviewed and approved this safety plan and authorize work to proceed.",
      name: plan.approverName || "Pending",
      date: plan.status === "approved" ? plan.date : undefined,
    },
  ];

  // Audit logs for version history
  const { data: auditLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/audit-logs", { safetyPlanId: plan.id }],
    queryFn: () => fetch(`/api/audit-logs?safetyPlanId=${plan.id}`).then(r => r.json()),
    enabled: !!plan.id,
  });

  const activeFlagMeta = flagDialog ? SAFETY_FLAG_META[flagDialog.key] : null;

  return (
    <div className="space-y-6 mx-auto" style={{ maxWidth: '210mm' }}>
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white shadow-sm border border-gray-100 h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            {plan.id ? (
              <h1 className="text-2xl font-bold text-gray-900">ISP-{String(plan.id).padStart(4, "0")}</h1>
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">Safety Plan</h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onStartSRB && (
            <Button onClick={onStartSRB} className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2">
              <ShieldAlert className="w-4 h-4" /> Start SRB
            </Button>
          )}
          {isTeamMember && onEdit ? (
            <Button onClick={onEdit} className="bg-brand-dark hover:bg-brand-light text-white font-bold gap-2">
              <Pencil className="w-4 h-4" /> Edit Plan
            </Button>
          ) : null}
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" /> Print to PDF
          </Button>
          {!isTeamMember && onReuse ? (
            <Button onClick={onReuse} variant="outline" className="border-brand-teal text-brand-teal hover:bg-cyan-50 font-bold gap-2">
              <Copy className="w-4 h-4" /> Reuse Template
            </Button>
          ) : null}
        </div>
      </div>

      <div className="print-area bg-white rounded-lg shadow-sm border-2 border-slate-200 overflow-hidden mx-auto" style={{ maxWidth: '210mm' }}>
        <SafetyPlanDetail
          title={plan.taskName}
          status={plan.status === "approved" ? "Active" : "Draft"}
          date={plan.date}
          shift={plan.shift}
          location={plan.location}
          machine={plan.machineNumber}
          group={plan.group}
          system={plan.system}
          safetyConcerns={safetyConcerns}
          clearedCount={cleared.length}
          onConcernClick={(id) => {
            const label = QUESTION_LABELS[id];
            if (label) setFlagDialog({ key: id, label });
          }}
          hazards={hazards}
          checklistHazards={checklistHazards.map(name => ({
            name,
            type: plan.assessments[name]?.checklistType || "Checklist",
          }))}
          ptwHazards={ptwHazards.map(name => ({
            name,
            type: plan.assessments[name]?.permitType || "Permit to Work",
          }))}
          signOffs={signOffs}
          engineers={plan.engineers}
          comments={plan.comments}
          planId={plan.id}
          auditLogs={auditLogs}
          versionOpen={versionOpen}
          onToggleVersion={() => setVersionOpen(v => !v)}
          onViewReusedPlan={onViewReusedPlan}
        />
      </div>

      {/* Safety Flag Dialog */}
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
