import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye } from "lucide-react";

import { SRBStepperBar } from "@/features/safety-review-board/components/SRBStepperBar";
import { SRBPreQuestionsStep } from "@/features/safety-review-board/components/SRBPreQuestionsStep";
import { SRBOriginalHazardsStep } from "@/features/safety-review-board/components/SRBOriginalHazardsStep";
import { SRBReassessmentStep } from "@/features/safety-review-board/components/SRBReassessmentStep";
import { SRBAcknowledgementsStep } from "@/features/safety-review-board/components/SRBAcknowledgementsStep";
import { SRBSignaturesStep } from "@/features/safety-review-board/components/SRBSignaturesStep";
import { SRBISODocStep } from "@/features/safety-review-board/components/SRBISODocStep";
import { SRBList } from "@/features/safety-review-board/components/SRBList";
import { SRBView } from "@/features/safety-review-board/components/SRBView";

import type { SRBStep, SRBFormData, SRBLaunchContext, SRBPreQuestions, SRBAcknowledgements } from "@/features/safety-review-board/types";
import { DEFAULT_FORM_DATA, DEFAULT_SIGNATORIES } from "@/features/safety-review-board/types";
import type { SRBRecord, SafetyPlan } from "@shared/schema";

type View = "list" | "form" | "view";

const STEP_TITLES: Record<SRBStep, string> = {
  1: "Pre-SRB Questions",
  2: "Original Hazards & Team",
  3: "Hazard Reassessment",
  4: "Post-Mitigation Acknowledgements",
  5: "Mandatory Signatures",
  6: "ISO Documentation",
};

export default function SRBPage() {
  const [view, setView] = useState<View>("list");
  const [viewingRecordId, setViewingRecordId] = useState<number | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [step, setStep] = useState<SRBStep>(1);
  const [completedSteps, setCompletedSteps] = useState<SRBStep[]>([]);
  const [formData, setFormData] = useState<SRBFormData>({ ...DEFAULT_FORM_DATA });
  const [formDirty, setFormDirty] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // Store all hazards from launch context for step 2 display
  const [allHazards, setAllHazards] = useState<string[]>([]);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: plans = [] } = useQuery<SafetyPlan[]>({ queryKey: ["/api/safety-plans"] });
  const { data: records = [] } = useQuery<SRBRecord[]>({ queryKey: ["/api/srb-records"] });

  // Check for launch context from SafetyPlanPage
  useEffect(() => {
    const raw = sessionStorage.getItem("srbLaunchContext");
    if (!raw) return;
    sessionStorage.removeItem("srbLaunchContext");

    try {
      const ctx: SRBLaunchContext = JSON.parse(raw);
      const escalated = ctx.hazards.filter((h) => {
        const a = ctx.assessments[h];
        return a && a.severity * a.likelihood > 5;
      });

      if (escalated.length === 0) {
        toast({ title: "No high-risk hazards found", description: "SRB requires hazards with risk score above 5.", variant: "destructive" });
        return;
      }

      // Check if an SRB already exists for this plan
      const existing = records.find(r => r.safetyPlanId === ctx.safetyPlanId);
      if (existing && existing.status !== "completed") {
        // Resume existing draft
        setFormData({
          safetyPlanId: existing.safetyPlanId,
          status: existing.status as SRBFormData["status"],
          serviceOrderNumber: existing.serviceOrderNumber,
          preQuestions: existing.preQuestions,
          escalatedHazards: existing.escalatedHazards || [],
          originalAssessments: existing.originalAssessments || {},
          reassessments: existing.reassessments || [],
          teamMembers: existing.teamMembers || [],
          acknowledgements: existing.acknowledgements || { ...DEFAULT_FORM_DATA.acknowledgements },
          signatories: existing.signatories?.length ? existing.signatories : [...DEFAULT_SIGNATORIES],
        });
        setAllHazards(ctx.hazards);
        setEditingRecordId(existing.id);
        setStep(1);
        setView("form");
        return;
      }

      // Start fresh
      setFormData({
        ...DEFAULT_FORM_DATA,
        safetyPlanId: ctx.safetyPlanId,
        escalatedHazards: escalated,
        originalAssessments: ctx.assessments,
        teamMembers: [ctx.leadName, ...ctx.engineers].filter(Boolean),
        reassessments: escalated.map((name) => {
          const a = ctx.assessments[name];
          return {
            hazardName: name,
            originalSeverity: a.severity,
            originalLikelihood: a.likelihood,
            originalRiskScore: a.severity * a.likelihood,
            originalMitigation: a.mitigation,
            additionalSafetyMeasures: "",
            mitigationPlan: "",
            newSeverity: 1,
            newLikelihood: 1,
          };
        }),
        signatories: [...DEFAULT_SIGNATORIES],
      });
      setAllHazards(ctx.hazards);
      setEditingRecordId(null);
      setStep(1);
      setCompletedSteps([]);
      setFormDirty(false);
      setView("form");
    } catch {
      // Invalid context
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<SRBFormData>) => apiRequest("POST", "/api/srb-records", data),
    onSuccess: async (res) => {
      const record = await res.json();
      setEditingRecordId(record.id);
      qc.invalidateQueries({ queryKey: ["/api/srb-records"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SRBFormData>) => {
      if (!editingRecordId) return Promise.reject("No record ID");
      return apiRequest("PATCH", `/api/srb-records/${editingRecordId}`, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/srb-records"] }),
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      if (!editingRecordId) return Promise.reject("No record ID");
      return apiRequest("POST", `/api/srb-records/${editingRecordId}/complete`, {});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/srb-records"] });
      toast({ title: "SRB completed successfully." });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to complete SRB", description: "Ensure all risks are LOW and all signatures are present.", variant: "destructive" });
    },
  });

  const autoSave = useCallback(() => {
    const payload = {
      safetyPlanId: formData.safetyPlanId,
      status: "in-progress" as const,
      serviceOrderNumber: formData.preQuestions.serviceOrderNumber,
      preQuestions: formData.preQuestions,
      escalatedHazards: formData.escalatedHazards,
      originalAssessments: formData.originalAssessments,
      reassessments: formData.reassessments,
      teamMembers: formData.teamMembers,
      acknowledgements: formData.acknowledgements,
      signatories: formData.signatories,
    };
    if (editingRecordId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }, [formData, editingRecordId]);

  const canAdvance = useCallback((s: SRBStep): boolean => {
    switch (s) {
      case 1:
        return formData.preQuestions.reasonForEscalation.trim() !== "" &&
               formData.preQuestions.procedureOrCondition.trim() !== "" &&
               formData.preQuestions.serviceOrderNumber.trim() !== "";
      case 2:
        return formData.escalatedHazards.length > 0 && formData.teamMembers.length > 0;
      case 3:
        return formData.reassessments.every(r => r.newSeverity * r.newLikelihood <= 3) &&
               formData.reassessments.every(r => r.additionalSafetyMeasures.trim() !== "" && r.mitigationPlan.trim() !== "");
      case 4:
        return Object.values(formData.acknowledgements).every(Boolean);
      case 5:
        return formData.signatories.every(s => s.name.trim() !== "" && s.signatureData !== null);
      case 6:
        return true;
    }
  }, [formData]);

  const advance = () => {
    if (!canAdvance(step)) {
      toast({ title: "Please complete all required fields before advancing.", variant: "destructive" });
      return;
    }
    autoSave();
    setCompletedSteps(prev => Array.from(new Set([...prev, step])) as SRBStep[]);
    if (step < 6) {
      setStep((step + 1) as SRBStep);
    }
  };

  const handleComplete = () => {
    if (!canAdvance(5)) {
      toast({ title: "All three signatures are required before completing.", variant: "destructive" });
      return;
    }
    autoSave();
    completeMutation.mutate();
  };

  const resetForm = () => {
    setView("list");
    setStep(1);
    setCompletedSteps([]);
    setFormData({ ...DEFAULT_FORM_DATA });
    setEditingRecordId(null);
    setFormDirty(false);
    setAllHazards([]);
  };

  const requestExit = () => {
    if (formDirty) {
      setShowExitConfirm(true);
    } else {
      resetForm();
    }
  };

  const updatePreQuestion = (field: keyof SRBPreQuestions, value: string) => {
    setFormData(prev => ({
      ...prev,
      preQuestions: { ...prev.preQuestions, [field]: value },
      serviceOrderNumber: field === "serviceOrderNumber" ? value : prev.serviceOrderNumber,
    }));
    setFormDirty(true);
  };

  const updateAcknowledgement = (field: keyof SRBAcknowledgements, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      acknowledgements: { ...prev.acknowledgements, [field]: value },
    }));
    setFormDirty(true);
  };

  // ── List View ──
  if (view === "list") {
    return <SRBList onViewRecord={(id) => { setViewingRecordId(id); setView("view"); }} />;
  }

  // ── Detail View ──
  if (view === "view" && viewingRecordId) {
    const record = records.find(r => r.id === viewingRecordId);
    if (!record) return null;
    const planName = plans.find(p => p.id === record.safetyPlanId)?.taskName || `Plan #${record.safetyPlanId}`;
    return <SRBView record={record} planName={planName} onBack={() => { setViewingRecordId(null); setView("list"); }} />;
  }

  // ── Form View ──
  return (
    <div>
      <div className="flex flex-col md:flex-row md:min-h-[600px] max-w-6xl mx-auto border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <SRBStepperBar
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={(s) => {
            if (completedSteps.includes(s) || s === step) setStep(s);
          }}
          serviceOrderNumber={formData.serviceOrderNumber}
          onExit={requestExit}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-display font-bold text-foreground">{STEP_TITLES[step]}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Step {step} of 6</p>
                </div>
              </div>

              {step === 1 && (
                <SRBPreQuestionsStep
                  values={formData.preQuestions}
                  onChange={updatePreQuestion}
                />
              )}

              {step === 2 && (
                <SRBOriginalHazardsStep
                  allHazards={allHazards.length > 0 ? allHazards : formData.escalatedHazards}
                  assessments={formData.originalAssessments}
                  escalatedHazards={formData.escalatedHazards}
                  teamMembers={formData.teamMembers}
                  onTeamMembersChange={(members) => {
                    setFormData(prev => ({ ...prev, teamMembers: members }));
                    setFormDirty(true);
                  }}
                />
              )}

              {step === 3 && (
                <SRBReassessmentStep
                  reassessments={formData.reassessments}
                  onChange={(reassessments) => {
                    setFormData(prev => ({ ...prev, reassessments }));
                    setFormDirty(true);
                  }}
                />
              )}

              {step === 4 && (
                <SRBAcknowledgementsStep
                  values={formData.acknowledgements}
                  onChange={updateAcknowledgement}
                />
              )}

              {step === 5 && (
                <SRBSignaturesStep
                  signatories={formData.signatories}
                  onChange={(signatories) => {
                    setFormData(prev => ({ ...prev, signatories }));
                    setFormDirty(true);
                  }}
                />
              )}

              {step === 6 && <SRBISODocStep />}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep((step - 1) as SRBStep)}>
                    &larr; Back
                  </Button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  {step < 6 && (
                    <Button type="button" onClick={advance} disabled={!canAdvance(step)}>
                      Next: {STEP_TITLES[(step + 1) as SRBStep]} &rarr;
                    </Button>
                  )}
                  {step === 6 && (
                    <Button
                      type="button"
                      onClick={handleComplete}
                      disabled={completeMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {completeMutation.isPending ? "Completing..." : "Complete & Submit SRB"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit SRB?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress has been auto-saved. You can resume this SRB later from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Working</AlertDialogCancel>
            <AlertDialogAction onClick={resetForm}>Exit to List</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
