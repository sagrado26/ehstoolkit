import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StepperBar } from "@/features/safety-plan/components/StepperBar";
import { InitialDetailsStep } from "@/features/safety-plan/components/InitialDetailsStep";
import { SafetyCheckStep } from "@/features/safety-plan/components/SafetyCheckStep";
import { HazardIDStep } from "@/features/safety-plan/components/HazardIDStep";
import { SignOffStep } from "@/features/safety-plan/components/SignOffStep";
import { PreviewModal } from "@/features/safety-plan/components/PreviewModal";
import { SafetyPlanList } from "@/features/safety-plan/components/SafetyPlanList";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { SafetyPlanFormData, HazardAssessment } from "@/features/safety-plan/types";
import type { SafetyPlan, Permit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SafetyPlanView } from "@/features/safety-plan/components/SafetyPlanView";
import { getHazardInfo } from "@/features/safety-plan/hazard-data";
import { Eye } from "lucide-react";

type View = "list" | "form" | "view";

/** Convert DB Assessment records to client HazardAssessment (adds checklist/permit fields from catalog) */
function enrichAssessments(
  assessments: Record<string, { severity: number; likelihood: number; mitigation: string }> | null
): Record<string, HazardAssessment> {
  if (!assessments) return {};
  const result: Record<string, HazardAssessment> = {};
  for (const [name, a] of Object.entries(assessments)) {
    const info = getHazardInfo(name);
    result[name] = {
      severity: a.severity,
      likelihood: a.likelihood,
      mitigation: a.mitigation,
      requiresChecklist: info?.checklistRequired ?? false,
      checklistType: info?.checklistType ?? "",
      requiresPtW: info?.permitRequired ?? false,
      permitType: info?.permitType ?? "",
    };
  }
  return result;
}

const STEP_TITLES = ["", "Task Details", "Safety Questions", "Hazard Identification", "Sign Off"];

const defaultFormData: SafetyPlanFormData = {
  group: "", taskName: "", date: "", location: "", shift: "", machineNumber: "",
  region: "Europe - Ireland", system: "Others", canSocialDistance: "yes",
  q1_specializedTraining: "no", q2_chemicals: "no", q3_impactOthers: "no",
  q4_falls: "no", q5_barricades: "no", q6_loto: "no", q7_lifting: "no",
  q8_ergonomics: "no", q9_otherConcerns: "no", q10_headInjury: "no", q11_otherPPE: "no",
  hazards: [], assessments: {} as Record<string, HazardAssessment>,
  leadName: "", approverName: "", engineers: [], comments: "", status: "pending",
};

export default function SafetyPlanPage() {
  const [view, setView] = useState<View>("list");
  const [viewingPlan, setViewingPlan] = useState<SafetyPlan | null>(null);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<SafetyPlanFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [reusedFromId, setReusedFromId] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: preferences } = useQuery<{
    isFirstTime: string;
    system: string;
    group: string;
    site: string;
  }>({
    queryKey: ["/api/user-preferences", "default"],
  });

  const { data: existingPlans = [] } = useQuery<SafetyPlan[]>({
    queryKey: ["/api/safety-plans"],
  });

  const { data: permits = [] } = useQuery<Permit[]>({
    queryKey: ["/api/permits"],
  });

  const knownValues = {
    machines: Array.from(new Set(existingPlans.map(p => p.machineNumber).filter(Boolean))) as string[],
    locations: Array.from(new Set(existingPlans.map(p => p.location).filter(Boolean))) as string[],
    shifts: Array.from(new Set(["Day", "Night", "Swing", ...existingPlans.map(p => p.shift).filter(Boolean)])) as string[],
  };

  // Determine current user from localStorage (set on last submission) or last known lead
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem("planflow_current_user") || ""; } catch { return ""; }
  });

  // Warn before closing tab with unsaved form data
  useEffect(() => {
    if (view !== "form" || !formDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [view, formDirty]);

  const submitMutation = useMutation({
    mutationFn: async (data: SafetyPlanFormData) => {
      if (editingPlanId) {
        const res = await apiRequest("PUT", `/api/safety-plans/${editingPlanId}`, {
          ...data,
          editedBy: data.leadName,
        });
        return { response: res, wasEdit: true, wasReuse: false };
      }
      const res = await apiRequest("POST", "/api/safety-plans", data);
      return { response: res, wasEdit: false, wasReuse: !!reusedFromId };
    },
    onSuccess: async ({ response, wasEdit, wasReuse }) => {
      if (wasReuse && reusedFromId) {
        try {
          const newPlan = await response.json();
          const newId = newPlan?.id;
          if (newId) {
            await apiRequest("POST", `/api/safety-plans/${reusedFromId}/reuse-log`, {
              reusedBy: formData.leadName,
              newPlanId: newId,
            });
          }
        } catch {
          // Non-critical — reuse log is best-effort
        }
      }

      if (formData.leadName) {
        try { localStorage.setItem("planflow_current_user", formData.leadName); } catch {}
        setCurrentUser(formData.leadName);
      }

      qc.invalidateQueries({ queryKey: ["/api/safety-plans"] });
      qc.invalidateQueries({ queryKey: ["/api/audit-logs"] });
      resetForm();
      toast({
        title: wasEdit
          ? "Safety Plan updated successfully."
          : wasReuse
            ? "New Safety Plan created from reuse."
            : "Safety Plan submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save safety plan.",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = useCallback(() => {
    setView("list");
    setStep(1);
    setCompletedSteps([]);
    setFormData(defaultFormData);
    setEditingPlanId(null);
    setReusedFromId(null);
    setFormDirty(false);
  }, []);

  const startNewForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      ...defaultFormData,
      system: preferences?.system || "Others",
      group: preferences?.group || "Europe",
      region: preferences?.site || "Europe - Ireland",
      date: today,
      canSocialDistance: "yes",
    });
    setStep(1);
    setCompletedSteps([]);
    setEditingPlanId(null);
    setReusedFromId(null);
    setFormDirty(false);
    setView("form");
  };

  const requestExit = () => {
    if (formDirty) {
      setShowExitConfirm(true);
    } else {
      resetForm();
    }
  };

  const handleInitialDetailsSubmit = (data: Partial<SafetyPlanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps([1]);
    setFormDirty(true);
    setStep(2);
  };

  // Validate before advancing to the next step
  const advance = () => {
    if (step === 3 && formData.hazards.length === 0) {
      toast({
        title: "No hazards identified",
        description: "Please add at least one hazard or confirm none apply before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setCompletedSteps(prev => Array.from(new Set([...prev, step])));
    setStep(prev => Math.min(prev + 1, 4) as 1 | 2 | 3 | 4);
  };

  // Validate before submit
  const handleSubmit = () => {
    if (!formData.leadName.trim()) {
      toast({
        title: "Lead name is required",
        description: "Please enter the lead assessor name before submitting.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const updateField = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setFormDirty(true);
  };

  // Team member edit — keeps existing plan, uses PUT to update
  const editPlan = (plan: SafetyPlan) => {
    setFormData({ ...defaultFormData, ...plan, assessments: enrichAssessments(plan.assessments) } as SafetyPlanFormData);
    setEditingPlanId(plan.id);
    setReusedFromId(null);
    setCompletedSteps([1, 2, 3]);
    setStep(1);
    setFormDirty(false);
    setView("form");
  };

  // Non-team reuse — copies plan but resets shift & location, submits as new entry
  const reusePlan = (plan: SafetyPlan) => {
    const today = new Date().toISOString().split("T")[0];
    const { id, status, ...planData } = plan;
    setFormData({
      ...defaultFormData,
      ...planData,
      assessments: enrichAssessments(plan.assessments),
      shift: "",
      location: "",
      date: today,
      leadName: "",
      approverName: "",
      engineers: [],
      comments: "",
      status: "pending",
    } as SafetyPlanFormData);
    setEditingPlanId(null);
    setReusedFromId(plan.id);
    setCompletedSteps([1, 2, 3]);
    setStep(1);
    setFormDirty(false);
    setView("form");
  };

  // Navigate to a reused plan from version history
  const viewPlanById = (planId: number) => {
    const plan = existingPlans.find(p => p.id === planId);
    if (plan) {
      setViewingPlan(plan);
      setView("view");
    }
  };

  if (view === "list") {
    return (
      <div className="p-4 sm:p-6">
        <SafetyPlanList onNew={startNewForm} onEdit={(id) => {
          const plan = existingPlans.find(p => p.id === id);
          if (plan) { setViewingPlan(plan); setView("view"); }
        }} />
      </div>
    );
  }

  if (view === "view" && viewingPlan) {
    const userOnTeam = currentUser ? (
      viewingPlan.leadName?.toLowerCase() === currentUser.toLowerCase() ||
      viewingPlan.approverName?.toLowerCase() === currentUser.toLowerCase() ||
      (viewingPlan.engineers || []).some((e: string) => e.toLowerCase() === currentUser.toLowerCase())
    ) : false;

    return (
      <div className="p-4 sm:p-6">
        <SafetyPlanView
          plan={viewingPlan as any}
          currentUser={currentUser}
          onBack={() => { setViewingPlan(null); setView("list"); }}
          onEdit={userOnTeam && viewingPlan.status !== "approved" ? () => editPlan(viewingPlan) : undefined}
          onReuse={!userOnTeam ? () => reusePlan(viewingPlan) : undefined}
          onViewReusedPlan={viewPlanById}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:min-h-[540px] max-w-6xl mx-auto border border-border rounded-lg overflow-hidden bg-card">
        <StepperBar
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={setStep}
          prefilled={{ system: formData.system, group: formData.group, region: formData.region, date: formData.date }}
          taskSummary={{ taskName: formData.taskName, shift: formData.shift, location: formData.location, machineNumber: formData.machineNumber }}
          onEditDetails={() => setStep(1)}
          onExit={requestExit}
        />

        <div className="flex-1 flex flex-col">
          <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
            <h2 className="text-base font-semibold">{STEP_TITLES[step]}</h2>
            <Button type="button" variant="outline" size="sm" onClick={requestExit}>Exit Record</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              {step === 1 && (
                <InitialDetailsStep
                  onSubmit={handleInitialDetailsSubmit}
                  defaultValues={{ system: formData.system, group: formData.group, region: formData.region, date: formData.date, canSocialDistance: formData.canSocialDistance }}
                  editValues={editingPlanId ? { taskName: formData.taskName, location: formData.location, shift: formData.shift, machineNumber: formData.machineNumber } : undefined}
                  knownValues={knownValues}
                />
              )}
              {step === 2 && (
                <SafetyCheckStep values={formData as any} onChange={(key, val) => updateField(key, val)} />
              )}
              {step === 3 && (
                <HazardIDStep
                  hazards={formData.hazards}
                  assessments={formData.assessments}
                  onHazardsChange={(hazards, assessments) => {
                    setFormData(prev => ({ ...prev, hazards, assessments }));
                    setFormDirty(true);
                  }}
                />
              )}
              {step === 4 && (
                <SignOffStep
                  leadName={formData.leadName}
                  approverName={formData.approverName ?? ""}
                  engineers={formData.engineers}
                  comments={formData.comments ?? ""}
                  linkedPermitId={formData.linkedPermitId}
                  permits={permits as any[]}
                  currentUser={currentUser || undefined}
                  onChange={updateField}
                />
              )}
              {step > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setStep(s => s - 1 as any)}>&larr; Back</Button>
                  <div className="flex items-center gap-2">
                    {step === 4 && (
                      <>
                        <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={submitMutation.isPending}>
                          {submitMutation.isPending
                            ? "Saving..."
                            : editingPlanId
                              ? "Update & Submit"
                              : "Complete & Submit"}
                        </Button>
                      </>
                    )}
                    {step < 4 && (
                      <Button type="button" onClick={advance} className="gap-2">
                        Next: {STEP_TITLES[step + 1]} &rarr;
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PreviewModal open={showPreview} onOpenChange={setShowPreview} data={formData} />

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes on this safety plan. If you exit now, your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={resetForm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
