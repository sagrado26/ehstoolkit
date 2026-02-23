import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Filter, FileText, Eye, Loader2, AlertTriangle, MapPin, Calendar, Users, Shield, Cpu, Hash, Clock, ChevronDown, History, X, TrendingUp, CheckCircle, XCircle, Pencil } from "lucide-react";
import { SortableHeader, nextSort, sortRows, type SortDir } from "@/components/ui/sortable-header";
import { useLocation } from "wouter";
import RiskHistoryChart from "@/components/RiskHistoryChart";
import type { SafetyPlan } from "@shared/schema";

const periods = ["1W", "1M", "6M", "1Y"];

interface RecentPlansTableProps {
  compact?: boolean;
}

interface LegacyHazard {
  name: string;
  severity: number;
  likelihood: number;
  mitigation: string;
}

function normalizeHazards(plan: SafetyPlan): { hazardNames: string[]; assessments: Record<string, { severity: number; likelihood: number; mitigation: string }> } {
  const rawHazards = plan.hazards || [];
  const existingAssessments = plan.assessments || {};
  
  if (rawHazards.length === 0) {
    return { hazardNames: [], assessments: existingAssessments };
  }
  
  const firstItem = rawHazards[0];
  if (typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem) {
    const legacyHazards = rawHazards as unknown as LegacyHazard[];
    const hazardNames = legacyHazards.map(h => h.name);
    const assessments: Record<string, { severity: number; likelihood: number; mitigation: string }> = {};
    legacyHazards.forEach(h => {
      assessments[h.name] = { severity: h.severity, likelihood: h.likelihood, mitigation: h.mitigation };
    });
    return { hazardNames, assessments };
  }
  
  return { hazardNames: rawHazards as string[], assessments: existingAssessments };
}

function getRiskLevel(plan: SafetyPlan): "low" | "medium" | "high" {
  const { assessments } = normalizeHazards(plan);
  const values = Object.values(assessments);
  if (values.length === 0) return "low";
  
  const avgRisk = values.reduce((sum, a) => sum + (a.severity * a.likelihood), 0) / values.length;
  if (avgRisk >= 9) return "high";
  if (avgRisk >= 5) return "medium";
  return "low";
}

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusDisplay(status: string): "approved" | "pending" | "review" | "rejected" {
  if (status === "approved") return "approved";
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "review";
}

const safetyQuestionLabels: Record<string, string> = {
  q1_specializedTraining: "Specialized Training",
  q2_chemicals: "Chemicals/Hazmat",
  q3_impactOthers: "Impact Others",
  q4_falls: "Fall Hazard",
  q5_barricades: "Barricades",
  q6_loto: "LOTO Required",
  q7_lifting: "Heavy Lifting",
  q8_ergonomics: "Ergonomics",
  q9_otherConcerns: "Other Concerns",
  q10_headInjury: "Head Injury Risk",
  q11_otherPPE: "Additional PPE",
  canSocialDistance: "Social Distance",
};

function SafetyPlanViewDialog({ plan, open, onOpenChange }: { plan: SafetyPlan | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approverName, setApproverName] = useState("");
  const [rejectorName, setRejectorName] = useState("");
  const [approveComments, setApproveComments] = useState("");
  const [rejectComments, setRejectComments] = useState("");
  const [, navigate] = useLocation();

  const approveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { approverName: string; comments: string } }) => {
      await apiRequest("POST", `/api/safety-plans/${id}/approve`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safety-plans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/audit-logs"] });
      toast({ title: "Plan Approved", description: "The safety plan has been approved successfully." });
      setShowApproveDialog(false);
      setApproverName("");
      setApproveComments("");
      onOpenChange(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { rejectedBy: string; comments: string } }) => {
      await apiRequest("POST", `/api/safety-plans/${id}/reject`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safety-plans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/audit-logs"] });
      toast({ title: "Plan Rejected", description: "The safety plan has been rejected." });
      setShowRejectDialog(false);
      setRejectorName("");
      setRejectComments("");
      onOpenChange(false);
    },
  });

  if (!plan) return null;

  const riskLevel = getRiskLevel(plan);
  const statusDisplay = getStatusDisplay(plan.status);

  const safetyQuestions = [
    { key: "q1_specializedTraining", value: plan.q1_specializedTraining },
    { key: "q2_chemicals", value: plan.q2_chemicals },
    { key: "q3_impactOthers", value: plan.q3_impactOthers },
    { key: "q4_falls", value: plan.q4_falls },
    { key: "q5_barricades", value: plan.q5_barricades },
    { key: "q6_loto", value: plan.q6_loto },
    { key: "q7_lifting", value: plan.q7_lifting },
    { key: "q8_ergonomics", value: plan.q8_ergonomics },
    { key: "q9_otherConcerns", value: plan.q9_otherConcerns },
    { key: "q10_headInjury", value: plan.q10_headInjury },
    { key: "q11_otherPPE", value: plan.q11_otherPPE },
  ];

  const canSocialDistance = plan.canSocialDistance === "yes";
  const { hazardNames: hazards, assessments } = normalizeHazards(plan);
  
  const totalRiskScore = hazards.reduce((sum, h) => {
    const a = assessments[h];
    return sum + (a ? a.severity * a.likelihood : 0);
  }, 0);
  const avgRiskScore = hazards.length > 0 ? Math.round(totalRiskScore / hazards.length) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 [&>button]:hidden overflow-hidden">
        {/* Modern Header with gradient */}
        <div className="bg-primary text-primary-foreground">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-xl font-bold tracking-tight">ISP-{String(plan.id).padStart(4, '0')}</DialogTitle>
                    <Badge className={`text-xs font-semibold border-0 ${
                      plan.status === "approved" 
                        ? "bg-emerald-500 text-white" 
                        : plan.status === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-amber-500 text-white"
                    }`}>
                      {plan.status === "approved" ? "Approved" : plan.status === "rejected" ? "Rejected" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="text-white/70 text-sm mt-1 ml-[52px]">{plan.group} · {plan.region}</DialogDescription>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-lg font-medium text-white/90">{plan.taskName}</p>
                  <Badge className={`text-xs font-semibold border-0 ${
                    riskLevel === "high" 
                      ? "bg-red-500 text-white" 
                      : riskLevel === "medium" 
                        ? "bg-amber-500 text-white" 
                        : "bg-emerald-500 text-white"
                  }`}>
                    {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    data-testid="button-close-dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </DialogClose>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(plan.date)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick info bar with Risk Overview */}
          <div className="bg-black/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-white/60" />
                <span className="font-medium">{plan.system}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-white/60" />
                <span className="font-mono font-medium">{plan.machineNumber || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/60" />
                <span>{plan.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" />
                <span>{plan.shift}</span>
              </div>
            </div>
            {hazards.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded px-2.5 py-1">
                  <span className="text-[10px] text-white/70 uppercase tracking-wider font-medium">Risk Overview</span>
                  <span className={`text-base font-bold px-1.5 py-0.5 rounded ${
                    avgRiskScore >= 9 ? "bg-red-500" : avgRiskScore >= 5 ? "bg-amber-500" : "bg-emerald-500"
                  } text-white`}>{avgRiskScore}</span>
                  <span className="text-[10px] text-white/60">avg</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/90">
                  <span className="font-bold">{safetyQuestions.filter(q => q.value === "yes").length}</span>
                  <span className="text-white/60">Concerns</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/90">
                  <span className="font-bold">{hazards.length}</span>
                  <span className="text-white/60">Hazards</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-220px)]">
          <div className="p-6 space-y-6">

            {/* Safety Assessment Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm">Safety Assessment</h4>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
                {safetyQuestions.map(({ key, value }) => {
                  const isYes = value === "yes";
                  return (
                    <div 
                      key={key} 
                      className={`py-1.5 px-2 rounded text-[10px] font-medium text-center truncate ${
                        isYes 
                          ? "bg-red-500 text-white" 
                          : "bg-muted text-muted-foreground"
                      }`}
                      title={safetyQuestionLabels[key]}
                    >
                      {safetyQuestionLabels[key]}
                    </div>
                  );
                })}
                <div 
                  className={`py-1.5 px-2 rounded text-[10px] font-medium text-center truncate flex items-center justify-center gap-1 ${
                    canSocialDistance 
                      ? "bg-emerald-500 text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}
                  title="Social Distance"
                >
                  <Users className="w-2.5 h-2.5" />
                  Social Dist.
                </div>
              </div>
            </div>

            {/* Hazards Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="font-semibold text-sm">Identified Hazards</h4>
                <Badge variant="secondary" className="text-xs ml-auto">{hazards.length} total</Badge>
              </div>
              {hazards.length > 0 ? (
                <div className="space-y-1.5">
                  {hazards.map((hazard) => {
                    const assessment = assessments[hazard];
                    const riskScore = assessment ? assessment.severity * assessment.likelihood : 0;
                    const riskBg = riskScore >= 9 ? "bg-red-500" : riskScore >= 5 ? "bg-amber-500" : "bg-emerald-500";
                    
                    return (
                      <div key={hazard} className="bg-card border border-border rounded-lg p-2.5 flex items-start gap-3">
                        <div className="shrink-0 text-center">
                          <div className={`${riskBg} text-white text-sm font-bold w-7 h-7 rounded flex items-center justify-center`}>
                            {riskScore}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-semibold text-sm">{hazard}</span>
                          </div>
                          {assessment && assessment.mitigation && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{assessment.mitigation}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground uppercase mb-0.5">S</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4].map((l) => (
                                <div key={l} className={`w-2.5 h-2.5 rounded-full ${(assessment?.severity || 0) >= l ? "bg-emerald-500" : "bg-border"}`} />
                              ))}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-muted-foreground uppercase mb-0.5">L</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4].map((l) => (
                                <div key={l} className={`w-2.5 h-2.5 rounded-full ${(assessment?.likelihood || 0) >= l ? "bg-emerald-500" : "bg-border"}`} />
                              ))}
                            </div>
                          </div>
                          <div className="text-center border-l border-border pl-3">
                            <p className="text-[9px] text-muted-foreground uppercase mb-0.5">Risk</p>
                            <div className={`${riskBg} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center`}>
                              {riskScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-xl p-8 text-center border border-dashed border-border">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No hazards identified</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">This plan has no specific hazards to mitigate</p>
                </div>
              )}
            </div>

            {/* Team & Sign Off Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-semibold text-sm">Team & Sign Off</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Submission Info */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Submission</p>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                      <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                        {plan.leadName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{plan.leadName}</p>
                      <p className="text-xs text-muted-foreground">Action Lead</p>
                    </div>
                  </div>
                  {plan.engineers && plan.engineers.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Engineers</p>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.engineers.map((eng, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{eng}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Approval Info */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Approval</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge className={`text-xs font-semibold ${
                        plan.status === "approved" 
                          ? "bg-emerald-500 text-white hover:bg-emerald-500"
                          : plan.status === "rejected"
                            ? "bg-red-500 text-white hover:bg-red-500"
                            : "bg-amber-500 text-white hover:bg-amber-500"
                      }`}>
                        {plan.status === "approved" ? "Approved" : plan.status === "rejected" ? "Rejected" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Approver</span>
                      <span className="text-sm font-medium">{plan.approverName || "---"}</span>
                    </div>
                    {plan.comments && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Comments</p>
                        <p className="text-sm">{plan.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Version History - Collapsible */}
              <Collapsible className="mt-4">
                <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                  <History className="w-3.5 h-3.5" />
                  <span>Version History</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Version 1</span>
                        <Badge variant="secondary" className="text-[10px]">Current</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(plan.date)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Status</span>
                        <span className="font-medium">{plan.status === "approved" ? "Approved" : plan.status === "rejected" ? "Rejected" : "Pending"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Submitter</span>
                        <span className="font-medium">{plan.leadName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-0.5">Approver</span>
                        <span className="font-medium">{plan.approverName || "---"}</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-muted/50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => { onOpenChange(false); navigate(`/form2?edit=${plan.id}`); }} data-testid="button-edit-plan">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {(plan.status === "pending" || plan.status === "rejected") && (
              <>
                <Button variant="destructive" className="gap-2" onClick={() => setShowRejectDialog(true)} data-testid="button-reject-plan">
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowApproveDialog(true)} data-testid="button-approve-plan">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-view-plan">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Approve Safety Plan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="approver-name">Your Name *</Label>
              <Input id="approver-name" value={approverName} onChange={(e) => setApproverName(e.target.value)} placeholder="Enter your name" data-testid="input-approver-name" />
            </div>
            <div>
              <Label htmlFor="approve-comments">Comments (optional)</Label>
              <Textarea id="approve-comments" value={approveComments} onChange={(e) => setApproveComments(e.target.value)} placeholder="Add approval comments..." data-testid="input-approve-comments" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!approverName.trim() || approveMutation.isPending} onClick={() => approveMutation.mutate({ id: plan.id, data: { approverName: approverName.trim(), comments: approveComments.trim() } })} data-testid="button-confirm-approve">
                {approveMutation.isPending ? "Approving..." : "Confirm Approval"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Reject Safety Plan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="rejector-name">Your Name *</Label>
              <Input id="rejector-name" value={rejectorName} onChange={(e) => setRejectorName(e.target.value)} placeholder="Enter your name" data-testid="input-rejector-name" />
            </div>
            <div>
              <Label htmlFor="reject-reason">Reason for Rejection *</Label>
              <Textarea id="reject-reason" value={rejectComments} onChange={(e) => setRejectComments(e.target.value)} placeholder="Explain why this plan is being rejected..." data-testid="input-reject-reason" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
              <Button variant="destructive" disabled={!rejectorName.trim() || !rejectComments.trim() || rejectMutation.isPending} onClick={() => rejectMutation.mutate({ id: plan.id, data: { rejectedBy: rejectorName.trim(), comments: rejectComments.trim() } })} data-testid="button-confirm-reject">
                {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default function RecentPlansTable({ compact = false }: RecentPlansTableProps) {
  const [activePeriod, setActivePeriod] = useState("1M");
  const [selectedPlan, setSelectedPlan] = useState<SafetyPlan | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [riskHistoryOpen, setRiskHistoryOpen] = useState(false);
  const [sort, setSort] = useState<{ field: string; dir: SortDir }>({ field: "", dir: null });
  const handleSort = (field: string) => setSort(prev => nextSort(prev.field, prev.dir, field));

  const { data: plans = [], isLoading } = useQuery<SafetyPlan[]>({
    queryKey: ["/api/safety-plans"],
  });

  const handleViewPlan = (plan: SafetyPlan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const riskColors = {
    low: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusColors = {
    approved: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    review: "bg-primary/10 text-primary border-primary/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Compact mobile view (used inside collapsible on mobile)
  if (compact) {
    return (
      <div className="divide-y divide-card-border">
        {plans.map((plan) => {
          const riskLevel = getRiskLevel(plan);
          const statusDisplay = getStatusDisplay(plan.status);
          return (
            <div 
              key={plan.id} 
              className="p-3 space-y-2 cursor-pointer hover:bg-primary/5 transition-colors"
              data-testid={`card-plan-compact-${plan.id}`}
              onClick={() => handleViewPlan(plan)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-primary/10">
                    <FileText className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium">ISP-{String(plan.id).padStart(4, '0')}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${riskColors[riskLevel]}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                </Badge>
              </div>
              
              <p className="text-sm font-medium truncate">{plan.taskName}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {plan.leadName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{plan.leadName.split(' ')[0]}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[statusDisplay]}`}>
                  {statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1)}
                </Badge>
              </div>
            </div>
          );
        })}
        {plans.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No safety plans yet. Create one to get started.
          </div>
        )}
        <SafetyPlanViewDialog 
          plan={selectedPlan} 
          open={viewDialogOpen} 
          onOpenChange={setViewDialogOpen} 
        />
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 lg:p-6 border-b border-card-border gap-4">
        <div>
          <h3 className="font-bold text-lg">Recent Safety Plans</h3>
          <p className="text-sm text-muted-foreground">Monitor and manage your ISP submissions</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-muted/50 p-1 rounded-lg">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activePeriod === period 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`button-plans-period-${period.toLowerCase()}`}
              >
                {period}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg" onClick={() => setRiskHistoryOpen(true)} data-testid="button-risk-history">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Risk History</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Risk History Dialog */}
      <Dialog open={riskHistoryOpen} onOpenChange={setRiskHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Calculated Risk History
            </DialogTitle>
            <DialogDescription>Risk assessment trends over time</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <RiskHistoryChart />
          </div>
        </DialogContent>
      </Dialog>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-muted/50">
              <SortableHeader label="Plan #" field="id" current={sort} onSort={handleSort} className="px-6" />
              <SortableHeader label="Title" field="taskName" current={sort} onSort={handleSort} className="px-6" />
              <SortableHeader label="Risk Level" field="riskLevel" current={sort} onSort={handleSort} className="px-6" />
              <SortableHeader label="Status" field="status" current={sort} onSort={handleSort} className="px-6" />
              <SortableHeader label="Submitted By" field="leadName" current={sort} onSort={handleSort} className="px-6" />
              <SortableHeader label="Date" field="createdAt" current={sort} onSort={handleSort} className="px-6" />
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {(sortRows(plans as any[], sort.field, sort.dir) as SafetyPlan[]).map((plan) => {
              const riskLevel = getRiskLevel(plan);
              const statusDisplay = getStatusDisplay(plan.status);
              return (
                <tr
                  key={plan.id}
                  className="border-b border-card-border last:border-0 hover:bg-primary/5 cursor-pointer transition-colors"
                  data-testid={`row-plan-${plan.id}`}
                  onClick={() => handleViewPlan(plan)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">ISP-{String(plan.id).padStart(4, '0')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium">{plan.taskName}</p>
                      <p className="text-xs text-muted-foreground">{plan.location}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className={riskColors[riskLevel]}>
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className={statusColors[statusDisplay]}>
                      {statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {plan.leadName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{plan.leadName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{formatDate(plan.createdAt)}</td>
                  <td className="py-4 px-6">
                    <Button variant="ghost" size="icon" data-testid={`button-view-plan-${plan.id}`} onClick={(e) => { e.stopPropagation(); handleViewPlan(plan); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No safety plans yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-card-border">
        {plans.map((plan) => {
          const riskLevel = getRiskLevel(plan);
          const statusDisplay = getStatusDisplay(plan.status);
          return (
            <div 
              key={plan.id} 
              className="p-4 space-y-3 cursor-pointer hover:bg-primary/5 transition-colors"
              data-testid={`card-plan-${plan.id}`}
              onClick={() => handleViewPlan(plan)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">ISP-{String(plan.id).padStart(4, '0')}</span>
                </div>
                <Badge variant="outline" className={riskColors[riskLevel]}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">{plan.taskName}</p>
                <p className="text-xs text-muted-foreground">{plan.location}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-muted">
                      {plan.leadName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{plan.leadName}</span>
                </div>
                <Badge variant="outline" className={statusColors[statusDisplay]}>
                  {statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(plan.createdAt)}</span>
                <Button variant="ghost" size="sm" data-testid={`button-view-plan-mobile-${plan.id}`} onClick={(e) => { e.stopPropagation(); handleViewPlan(plan); }}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          );
        })}
        {plans.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No safety plans yet. Create one to get started.
          </div>
        )}
      </div>

      <SafetyPlanViewDialog 
        plan={selectedPlan} 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
      />
    </div>
  );
}
