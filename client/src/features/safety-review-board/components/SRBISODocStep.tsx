import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

const ISO_LEVELS = [
  {
    key: "L1",
    title: "L1 — Policy: Purpose of the Safety Review Board",
    content: [
      "The Safety Review Board (SRB) exists to provide a structured, multi-stakeholder review for any task where initial hazard assessment identifies High (8–11) or Extreme (12–16) risk scores.",
      "The policy mandates that no activity with an unmitigated High or Extreme risk may commence until the SRB process is completed, all risks are reduced to LOW (1–3), and three mandatory signatories have provided witnessed sign-off.",
      "This policy applies to all CS field operations at ASML customer sites and aligns with ASML's commitment to zero-harm workplace practices.",
    ],
  },
  {
    key: "L2",
    title: "L2 — Process: SRB Workflow Steps",
    content: [
      "Step 1: Pre-SRB escalation questions are completed by the Team Lead, identifying the specific trigger condition and service order number.",
      "Step 2: Original safety plan hazards and team composition are reviewed and confirmed by all SRB participants. Original hazard values remain intact and unchanged.",
      "Step 3: Each escalated hazard undergoes a second assessment cycle. Additional controls and mitigations are identified and documented. The reassessed risk score must reach LOW (1–3).",
      "Step 4: All SRB participants acknowledge the adequacy of the new control measures through six structured acknowledgement questions.",
      "Step 5: Three mandatory signatories — EHS Specialist/Safety Engineer, Fab Team Lead, CS Management Representative — provide witnessed digital signatures with timestamps.",
      "Step 6: The completed SRB record is stored against the originating safety plan for ISO-compliant audit retrieval.",
    ],
  },
  {
    key: "L3",
    title: "L3 — Work Instructions: Detailed SRB Procedure",
    content: [
      "3.1 Trigger Criteria: Any hazard assessment with severity × likelihood ≥ 8 automatically triggers SRB requirement. The system flags these hazards and prevents work commencement without SRB completion.",
      "3.2 Pre-SRB Questions: The initiating Lead must complete all five pre-SRB justification questions before the board convenes. Incomplete questions invalidate the SRB initiation.",
      "3.3 Hazard Re-assessment: Each escalated hazard must be individually re-assessed. The additional safety measures field must describe controls beyond those in the original safety plan. The mitigation plan must be specific, actionable, and measurable.",
      "3.4 Risk Acceptance Threshold: The board may not proceed to sign-off if any reassessed hazard score exceeds 3 (LOW band). Additional controls must be identified until all scores reach LOW.",
      "3.5 Acknowledgement Protocol: All six post-mitigation acknowledgement questions must be affirmatively answered by the SRB team before signature collection begins.",
      "3.6 Signature Protocol: All three mandatory signatories must provide their full name, digital signature, and timestamp (mm/dd/yy + 24-hour time). Each signer confirms they have personally reviewed the full SRB document.",
      "3.7 Record Retention: Completed SRB records are retained indefinitely as part of the original safety plan record and are available for ISO audit at any time.",
    ],
  },
  {
    key: "L4",
    title: "L4 — Forms, Templates & Checklists",
    content: [
      "Form SRB-001: Pre-SRB Escalation Questions (5 mandatory items) — Captures escalation reason, procedure reference, service order number, coach update status, and customer safety process completion.",
      "Form SRB-002: Original Hazard Record (read-only, auto-populated from safety plan) — Displays all hazards with original severity, likelihood, risk scores, and mitigations. Escalated items are flagged.",
      "Form SRB-003: Hazard Reassessment Matrix (before/after risk scoring) — Side-by-side comparison of original vs. reassessed values with mandatory fields for additional safety measures and new mitigation plans.",
      "Form SRB-004: Six-Point Acknowledgement Checklist — Binary yes/no checklist for post-mitigation review confirmation.",
      "Form SRB-005: Three-Party Signature Sheet with Timestamps — Digital signature capture for EHS Specialist, Fab Team Lead, and CS Management Representative with auto-generated timestamps.",
      "All forms are captured digitally within this system and linked to the originating safety plan ID.",
    ],
  },
  {
    key: "L5",
    title: "L5 — Records Generated",
    content: [
      "Upon completion, the SRB process generates the following records:",
      "• SRB Record (database entry linked to the originating Safety Plan ID)",
      "• Pre-SRB Question responses with service order reference",
      "• Original hazard snapshot (immutable at time of SRB creation — original values frozen for audit integrity)",
      "• Hazard reassessment records showing before/after risk scores, additional safety measures, and new mitigation plans",
      "• Six acknowledgement responses with implicit timestamps",
      "• Three digital signatures with role designation, full name, and 24-hour timestamps (mm/dd/yy HH:mm)",
      "• ISO L1–L5 documentation reference (this document)",
      "Records are queryable by Safety Plan ID, Service Order Number, date range, and completion status.",
    ],
  },
];

export function SRBISODocStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
          <FileText className="h-4.5 w-4.5 text-brand" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">ISO Documentation (L1–L5)</h3>
          <p className="text-xs text-muted-foreground">Structured SRB process documentation for ISO compliance</p>
        </div>
      </div>

      <Tabs defaultValue="L1">
        <TabsList className="w-full grid grid-cols-5">
          {ISO_LEVELS.map((level) => (
            <TabsTrigger key={level.key} value={level.key} className="text-xs font-bold">
              {level.key}
            </TabsTrigger>
          ))}
        </TabsList>

        {ISO_LEVELS.map((level) => (
          <TabsContent key={level.key} value={level.key} className="mt-4">
            <ScrollArea className="h-[360px] rounded-lg border border-border bg-card">
              <div className="p-5">
                <h4 className="text-sm font-bold text-brand mb-4">{level.title}</h4>
                <div className="space-y-3">
                  {level.content.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
