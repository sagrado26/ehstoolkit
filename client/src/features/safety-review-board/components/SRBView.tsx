import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { NameAvatar } from "@/components/ui/name-avatar";
import { cn } from "@/lib/utils";
import { getRiskColor } from "@/features/safety-plan/risk-utils";
import { ArrowLeft, ShieldAlert, CheckCircle2, XCircle, ArrowRight, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SRBRecord } from "@shared/schema";

interface Props {
  record: SRBRecord;
  planName: string;
  onBack: () => void;
}

const SEVERITY_LABELS = ["", "Negligible", "Minor", "Major", "Catastrophic"];
const LIKELIHOOD_LABELS = ["", "Unlikely", "Possible", "Likely", "Almost Certain"];

const ACK_LABELS: Record<string, string> = {
  ack1_hazardReEvaluated: "Has the hazard been fully re-evaluated?",
  ack2_participantsReviewed: "Have all SRB participants reviewed the new mitigations?",
  ack3_controlsValidated: "Has the team validated that the new control measures are workable?",
  ack4_residualRiskAgreed: "Has the team discussed and agreed on the residual risk?",
  ack5_safeActionAcknowledged: "Have all parties acknowledged the new safe plan of action?",
  ack6_newRiskAcceptable: "Is the new hazard value (Severity, Likelihood, Risk) acceptable and at LOW?",
};

export function SRBView({ record, planName, onBack }: Props) {
  const pq = record.preQuestions;
  const acks = record.acknowledgements;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white shadow-sm border border-gray-100 h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <h1 className="text-xl font-display font-bold text-foreground">SRB-{String(record.id).padStart(3, "0")}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{planName}</p>
          </div>
        </div>
        <Badge className={cn(
          "capitalize text-xs",
          record.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
          {record.status}
        </Badge>
      </div>

      {/* Pre-SRB Questions */}
      {pq && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-amber-50/50 border-amber-100">
            <h3 className="text-sm font-semibold">Pre-SRB Justification Questions</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">1. Reason for Escalation</p>
              <p className="text-sm mt-1">{pq.reasonForEscalation}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">2. Procedure / Condition</p>
              <p className="text-sm mt-1">{pq.procedureOrCondition}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">3. Service Order Number</p>
              <p className="text-sm font-mono mt-1">{pq.serviceOrderNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">4. Coach Update Needed</p>
                <Badge variant="outline" className="mt-1 capitalize">{pq.coachUpdateNeeded}</Badge>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">5. Customer Safety Completed</p>
                <Badge variant="outline" className="mt-1 capitalize">{pq.customerSafetyCompleted}</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Team Members */}
      {(record.teamMembers || []).length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">SRB Team Members</h3>
          <div className="flex flex-wrap gap-2">
            {record.teamMembers.map((name) => (
              <div key={name} className="flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1">
                <NameAvatar name={name} className="h-6 w-6 text-[10px]" />
                <span className="text-xs font-medium">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hazard Reassessments */}
      {(record.reassessments || []).length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="text-sm font-semibold">Hazard Reassessments</h3>
          </div>
          <div className="divide-y divide-border">
            {record.reassessments.map((r) => {
              const origRisk = getRiskColor(r.originalRiskScore);
              const newScore = r.newSeverity * r.newLikelihood;
              const newRisk = getRiskColor(newScore);

              return (
                <div key={r.hazardName} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold">{r.hazardName}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-[10px]", origRisk.bg, origRisk.text)}>{origRisk.label} ({r.originalRiskScore})</Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge className={cn("text-[10px]", newRisk.bg, newRisk.text)}>{newRisk.label} ({newScore})</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Original</p>
                      <p className="text-xs">Severity: {SEVERITY_LABELS[r.originalSeverity]} · Likelihood: {LIKELIHOOD_LABELS[r.originalLikelihood]}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.originalMitigation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-brand mb-1">SRB Reassessment</p>
                      <p className="text-xs">Severity: {SEVERITY_LABELS[r.newSeverity]} · Likelihood: {LIKELIHOOD_LABELS[r.newLikelihood]}</p>
                      <p className="text-xs text-muted-foreground mt-1"><strong>Safety Measures:</strong> {r.additionalSafetyMeasures}</p>
                      <p className="text-xs text-muted-foreground mt-0.5"><strong>Mitigation:</strong> {r.mitigationPlan}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Acknowledgements */}
      {acks && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-blue-50/50 border-blue-100">
            <h3 className="text-sm font-semibold">Post-Mitigation Acknowledgements</h3>
          </div>
          <div className="p-4 space-y-2">
            {Object.entries(ACK_LABELS).map(([key, label]) => {
              const checked = acks[key as keyof typeof acks];
              return (
                <div key={key} className="flex items-center gap-3">
                  {checked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm">{label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Signatures */}
      {(record.signatories || []).length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-violet-50/50 border-violet-100">
            <h3 className="text-sm font-semibold">Mandatory Sign-Offs</h3>
          </div>
          <div className="divide-y divide-border">
            {record.signatories.map((sig) => (
              <div key={sig.role} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{sig.role}</p>
                  <p className="text-xs text-muted-foreground">{sig.name}</p>
                  {sig.signedAt && (
                    <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{sig.signedAt}</p>
                  )}
                </div>
                {sig.signatureData ? (
                  <div className="w-32 h-16 border border-border rounded bg-white">
                    <img src={sig.signatureData} alt={`${sig.name} signature`} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Unsigned</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ISO Reference */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold">ISO Documentation Reference (L1–L5)</h3>
          </div>
        </div>
        <div className="p-4">
          <Tabs defaultValue="L1">
            <TabsList className="w-full grid grid-cols-5">
              {["L1", "L2", "L3", "L4", "L5"].map((k) => (
                <TabsTrigger key={k} value={k} className="text-xs font-bold">{k}</TabsTrigger>
              ))}
            </TabsList>
            {["L1", "L2", "L3", "L4", "L5"].map((k) => (
              <TabsContent key={k} value={k}>
                <ScrollArea className="h-[200px]">
                  <p className="text-xs text-muted-foreground p-2">ISO {k} documentation is recorded as part of the SRB process. See the full SRB form for detailed content.</p>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
