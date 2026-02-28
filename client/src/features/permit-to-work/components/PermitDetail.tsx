import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, FileText, MapPin, User, Calendar, Briefcase, Box, AlertTriangle,
  FlaskConical, Users, Radio, Shield, Wrench, Siren, HeartPulse, ShieldCheck,
  CheckCircle2, XCircle, Printer, Check,
} from "lucide-react";
import { GasMeasurementPanel } from "./GasMeasurementPanel";
import { ApprovalWorkflow } from "./ApprovalWorkflow";
import { SafetyRouteBack } from "./SafetyRouteBack";
import type {
  SpaceIdentification, CommunicationMethod, PhysicalHazardItem,
  AtmosphericHazardItem, ToolChecklistItem, ExtractionSituation,
  ExtractionMethod, ExtractionEquipment, MedicalEquipmentItem, EnhancedSignOff,
} from "../types";

interface Permit {
  id: number;
  date: string;
  submitter: string;
  manager: string;
  location: string;
  workType: string;
  permitType: string;
  workDescription: string;
  status: string;
  authorityName: string;
  o2Level: string | null;
  nitrogenPurge: string | null;
  entrySupervisor: string | null;
  standbyPerson: string | null;
  hazardAssessment: string | null;
  respiratoryProtection: string | null;
  isolationMethods: string | null;
  chemicalInventory: string | null;
  sdsDocuments: string | null;
  ppeRequirements: string | null;
  containmentPlan: string | null;
  srbRequired: string | null;
  srbPrimaryRoute: string | null;
  srbSecondaryRoute: string | null;
  srbAssemblyPoint: string | null;
  srbEmergencyContact: string | null;
  requestorPhone: string | null;
  serviceOrderNumber: string | null;
  procedureName: string | null;
  customerFab: string | null;
  machineType: string | null;
  machineNumber: string | null;
  customerNotified: string | null;
  customerContactName: string | null;
  customerContactPhone: string | null;
  activityDurationHours: string | null;
  expectedStartDate: string | null;
  expectedStartTime: string | null;
  expectedEndDate: string | null;
  expectedEndTime: string | null;
  multipleShifts: string | null;
  attendants: string | null;
  entrants: string | null;
  atmosphericTester: string | null;
  extractionPlanReviewed: string | null;
  ertContactInfo: string | null;
  spaceIdentification: SpaceIdentification | null;
  communicationMethod: CommunicationMethod | null;
  physicalHazards: PhysicalHazardItem[] | null;
  atmosphericHazards: AtmosphericHazardItem[] | null;
  toolsChecklist: ToolChecklistItem[] | null;
  extractionSituations: ExtractionSituation[] | null;
  extractionMethods: ExtractionMethod[] | null;
  extractionEquipment: ExtractionEquipment[] | null;
  medicalEquipment: MedicalEquipmentItem[] | null;
  enhancedSignOff: EnhancedSignOff | null;
}

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-muted text-muted-foreground border-border",
};

const PERMIT_TYPE_LABELS: Record<string, { label: string; icon: typeof Box; color: string }> = {
  "confined-space": { label: "Confined Space", icon: Box, color: "text-brand" },
  "hazardous-space": { label: "Hazardous Space", icon: AlertTriangle, color: "text-amber-600" },
  "hazardous-chemicals": { label: "Hazardous Chemicals", icon: FlaskConical, color: "text-red-600" },
};

// ── Helpers ────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1 mb-3">
      {num}. {title}
    </p>
  );
}

function InlineTag({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border",
      active
        ? "bg-brand/5 text-brand border-brand/20"
        : "bg-muted/50 text-muted-foreground border-border line-through opacity-50"
    )}>
      {active ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────

interface Props {
  permitId: number;
  onBack: () => void;
}

export function PermitDetail({ permitId, onBack }: Props) {
  const { data: permit, isLoading } = useQuery<Permit>({
    queryKey: [`/api/permits/${permitId}`],
  });

  if (isLoading || !permit) {
    return (
      <div className="p-8 text-center">
        <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading permit...</p>
      </div>
    );
  }

  const typeConfig = PERMIT_TYPE_LABELS[permit.permitType];
  const showGasMonitoring = permit.permitType === "confined-space" || permit.permitType === "hazardous-space";
  const isCS = permit.permitType === "confined-space";

  // Parse JSONB fields
  const parse = <T,>(val: T | string | null): T | null => {
    if (!val) return null;
    if (typeof val === "string") return JSON.parse(val) as T;
    return val;
  };

  const spaceId = parse<SpaceIdentification>(permit.spaceIdentification);
  const commMethod = parse<CommunicationMethod>(permit.communicationMethod);
  const physHazards = parse<PhysicalHazardItem[]>(permit.physicalHazards);
  const atmHazards = parse<AtmosphericHazardItem[]>(permit.atmosphericHazards);
  const tools = parse<ToolChecklistItem[]>(permit.toolsChecklist);
  const extSituations = parse<ExtractionSituation[]>(permit.extractionSituations);
  const extMethods = parse<ExtractionMethod[]>(permit.extractionMethods);
  const extEquipment = parse<ExtractionEquipment[]>(permit.extractionEquipment);
  const medEquipment = parse<MedicalEquipmentItem[]>(permit.medicalEquipment);
  const signOff = parse<EnhancedSignOff>(permit.enhancedSignOff);

  const activeSpaces = spaceId ? Object.entries(spaceId).filter(([, v]) => v === true).map(([k]) => k) : [];

  return (
    <div className="space-y-4 max-w-4xl print:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-display font-bold">PTW-{String(permit.id).padStart(4, "0")}</h1>
              <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES[permit.status])}>
                {permit.status === "approved" ? "Issued" : permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
              </Badge>
              {typeConfig && <Badge variant="outline" className="text-[10px]">{typeConfig.label}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{permit.workType} — {permit.location}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 h-7 text-xs">
          <Printer className="h-3 w-3" /> Print
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block border-b-2 border-brand pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Permit to Work — PTW-{String(permit.id).padStart(4, "0")}</h1>
            <p className="text-sm text-muted-foreground">{typeConfig?.label ?? permit.workType} — {permit.location}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Status: {permit.status.toUpperCase()}</p>
            <p>Date: {permit.date}</p>
          </div>
        </div>
      </div>

      {/* ── Content sections ── */}
      <div className="border border-border rounded-lg overflow-hidden bg-card print:border-0 print:rounded-none">
        <div className="p-4 space-y-5 print:p-0">

          {/* Section 1: General Info */}
          <section>
            <SectionHeader num="1" title="General Information" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Date" value={permit.date} />
              <Field label="Requestor" value={permit.submitter} />
              <Field label="Phone" value={permit.requestorPhone} />
              <Field label="Manager" value={permit.manager} />
              <Field label="Location" value={permit.location} />
              <Field label="PTW Service Order" value={permit.serviceOrderNumber} />
              <Field label="Work Type" value={permit.workType} />
              <Field label="Procedure" value={permit.procedureName} />
            </div>
            {permit.workDescription && (
              <div className="mt-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Description / Purpose</p>
                <p className="text-sm leading-relaxed">{permit.workDescription}</p>
              </div>
            )}
          </section>

          {/* Section 3: Customer & Schedule */}
          {(permit.customerFab || permit.machineType || permit.expectedStartDate) && (
            <section>
              <SectionHeader num="3" title="Customer & Schedule" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Customer & Fab" value={permit.customerFab} />
                <Field label="Machine Type" value={permit.machineType} />
                <Field label="Machine #" value={permit.machineNumber} />
                <Field label="Customer Notified" value={permit.customerNotified === "yes" ? "Yes" : permit.customerNotified === "no" ? "No" : null} />
                <Field label="Contact" value={permit.customerContactName} />
                <Field label="Contact Phone" value={permit.customerContactPhone} />
                <Field label="Duration" value={permit.activityDurationHours ? `${permit.activityDurationHours} hr` : null} />
                <Field label="Multiple Shifts" value={permit.multipleShifts === "yes" ? "Yes" : null} />
                <Field label="Start" value={permit.expectedStartDate ? `${permit.expectedStartDate} ${permit.expectedStartTime ?? ""}` : null} />
                <Field label="End" value={permit.expectedEndDate ? `${permit.expectedEndDate} ${permit.expectedEndTime ?? ""}` : null} />
              </div>
            </section>
          )}

          {/* ── Confined Space sections ── */}
          {isCS && (
            <>
              {/* Space Identification */}
              {activeSpaces.length > 0 && (
                <section>
                  <SectionHeader num="5" title="Confined Space Identification" />
                  <div className="flex flex-wrap gap-1.5">
                    {activeSpaces.map((k) => (
                      <InlineTag key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} active />
                    ))}
                  </div>
                  {spaceId?.other && <p className="text-xs text-muted-foreground mt-1.5">Other: {spaceId.other}</p>}
                </section>
              )}

              {/* Personnel */}
              {(permit.entrySupervisor || permit.attendants || permit.entrants) && (
                <section>
                  <SectionHeader num="6" title="Personnel" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Field label="Entry Supervisor" value={permit.entrySupervisor} />
                    <Field label="Standby Person" value={permit.standbyPerson} />
                    <Field label="Attendant(s)" value={permit.attendants} />
                    <Field label="Entrant(s)" value={permit.entrants} />
                    <Field label="Atmospheric Tester" value={permit.atmosphericTester} />
                    <Field label="Initial O2" value={permit.o2Level ? `${permit.o2Level}%` : null} />
                    <Field label="N2 Purge" value={permit.nitrogenPurge === "yes" ? "Required" : permit.nitrogenPurge === "no" ? "N/A" : null} />
                    <Field label="Extraction Plan Reviewed" value={permit.extractionPlanReviewed === "yes" ? "Yes" : null} />
                  </div>
                </section>
              )}

              {/* Communication */}
              {commMethod && (commMethod.verbalVisual || commMethod.radio || commMethod.other) && (
                <section>
                  <p className="text-[10px] text-muted-foreground mb-1.5">Communication Method</p>
                  <div className="flex flex-wrap gap-1.5">
                    {commMethod.verbalVisual && <InlineTag label="Verbal/Visual" active />}
                    {commMethod.radio && <InlineTag label="Radio" active />}
                    {commMethod.other && <InlineTag label={`Other: ${commMethod.otherDescription}`} active />}
                  </div>
                </section>
              )}

              {/* Physical Hazards */}
              {physHazards && physHazards.some(h => h.hazardPresent) && (
                <section>
                  <SectionHeader num="7a" title="Physical Hazards" />
                  <div className="border border-border rounded-md overflow-hidden text-sm">
                    <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-x-3 px-3 py-1.5 bg-muted/40 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Hazard</span>
                      <span className="w-8 text-center">Present</span>
                      <span>Control</span>
                      <span className="w-8 text-center">Applied</span>
                    </div>
                    {physHazards.filter(h => h.hazardPresent).map(h => (
                      <div key={h.id} className="grid grid-cols-[1fr_auto_1fr_auto] gap-x-3 items-center px-3 py-1.5 border-b border-border last:border-0 bg-amber-50/30 dark:bg-amber-500/5">
                        <span className="text-sm">{h.hazardLabel}</span>
                        <span className="w-8 text-center"><AlertTriangle className="h-3.5 w-3.5 text-amber-500 mx-auto" /></span>
                        <span className="text-sm text-muted-foreground">{h.controlLabel}</span>
                        <span className="w-8 text-center">
                          {h.controlApplied
                            ? <Check className="h-3.5 w-3.5 text-green-600 mx-auto" />
                            : <XCircle className="h-3.5 w-3.5 text-red-500 mx-auto" />
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Atmospheric Hazards */}
              {atmHazards && atmHazards.some(h => h.hazardPresent) && (
                <section>
                  <SectionHeader num="7b" title="Atmospheric Hazards" />
                  <div className="border border-border rounded-md overflow-hidden text-sm">
                    <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-x-3 px-3 py-1.5 bg-muted/40 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Hazard</span>
                      <span className="w-8 text-center">Present</span>
                      <span>Monitoring</span>
                      <span className="w-8 text-center">Deployed</span>
                    </div>
                    {atmHazards.filter(h => h.hazardPresent).map(h => (
                      <div key={h.id} className="grid grid-cols-[1fr_auto_1fr_auto] gap-x-3 items-center px-3 py-1.5 border-b border-border last:border-0 bg-red-50/30 dark:bg-red-500/5">
                        <span className="text-sm">{h.hazardLabel}</span>
                        <span className="w-8 text-center"><AlertTriangle className="h-3.5 w-3.5 text-red-500 mx-auto" /></span>
                        <span className="text-sm text-muted-foreground">{h.monitorLabel}</span>
                        <span className="w-8 text-center">
                          {h.monitorDeployed
                            ? <Check className="h-3.5 w-3.5 text-green-600 mx-auto" />
                            : <XCircle className="h-3.5 w-3.5 text-red-500 mx-auto" />
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tools */}
              {tools && tools.some(t => t.checked) && (
                <section>
                  <SectionHeader num="8" title="Tools & Equipment" />
                  <div className="flex flex-wrap gap-1.5">
                    {tools.filter(t => t.checked).map(t => (
                      <InlineTag key={t.id} label={t.label} active />
                    ))}
                  </div>
                </section>
              )}

              {/* Emergency Plan */}
              {(permit.ertContactInfo || (extSituations && extSituations.some(s => s.applicable))) && (
                <section>
                  <SectionHeader num="9" title="Emergency Extraction Plan" />
                  {permit.ertContactInfo && <Field label="ERT Contact" value={permit.ertContactInfo} />}
                  {extSituations && extSituations.some(s => s.applicable) && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Extraction Situations</p>
                      <div className="flex flex-wrap gap-1.5">
                        {extSituations.filter(s => s.applicable).map(s => <InlineTag key={s.id} label={s.label} active />)}
                      </div>
                    </div>
                  )}
                  {extMethods && extMethods.some(m => m.selected) && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Extraction Methods</p>
                      <div className="flex flex-wrap gap-1.5">
                        {extMethods.filter(m => m.selected).map(m => <InlineTag key={m.id} label={m.label} active />)}
                      </div>
                    </div>
                  )}
                  {extEquipment && extEquipment.some(e => e.available) && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Extraction Equipment</p>
                      <div className="flex flex-wrap gap-1.5">
                        {extEquipment.filter(e => e.available).map(e => <InlineTag key={e.id} label={e.label} active />)}
                      </div>
                    </div>
                  )}
                  {medEquipment && medEquipment.some(m => m.available) && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Medical Equipment</p>
                      <div className="flex flex-wrap gap-1.5">
                        {medEquipment.filter(m => m.available).map(m => <InlineTag key={m.id} label={m.label} active />)}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Enhanced Sign-off */}
              {signOff && (signOff.ehsSpecialistName || signOff.managerName) && (
                <section>
                  <SectionHeader num="11" title="Authority & Sign-off" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {signOff.ehsSpecialistName && (
                      <div className="border border-border rounded-md p-3 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">11a. EHS Specialist</p>
                        <Field label="Name" value={signOff.ehsSpecialistName} />
                        <Field label="Date" value={signOff.ehsSpecialistDate} />
                        {signOff.ehsSpecialistSignature && (
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-0.5">Signature</p>
                            <img src={signOff.ehsSpecialistSignature} alt="EHS Signature" className="h-10 object-contain border rounded" />
                          </div>
                        )}
                      </div>
                    )}
                    {signOff.managerName && (
                      <div className="border border-border rounded-md p-3 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">11b. Responsible Manager</p>
                        <Field label="Name" value={signOff.managerName} />
                        <Field label="Date" value={signOff.managerDate} />
                        {signOff.managerSignature && (
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-0.5">Signature</p>
                            <img src={signOff.managerSignature} alt="Manager Signature" className="h-10 object-contain border rounded" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── Hazardous Space (non-CS) ── */}
          {permit.permitType === "hazardous-space" && permit.hazardAssessment && (
            <section>
              <SectionHeader num="HS" title="Hazardous Space Details" />
              <div className="grid grid-cols-1 gap-3">
                <Field label="Hazard Assessment" value={permit.hazardAssessment} />
                <Field label="Respiratory Protection" value={permit.respiratoryProtection} />
                <Field label="Isolation Methods" value={permit.isolationMethods} />
              </div>
            </section>
          )}

          {/* ── Hazardous Chemicals (non-CS) ── */}
          {permit.permitType === "hazardous-chemicals" && permit.chemicalInventory && (
            <section>
              <SectionHeader num="HC" title="Hazardous Chemicals Details" />
              <div className="grid grid-cols-1 gap-3">
                <Field label="Chemical Inventory" value={permit.chemicalInventory} />
                <Field label="SDS Documents" value={permit.sdsDocuments} />
                <Field label="PPE Requirements" value={permit.ppeRequirements} />
                <Field label="Containment Plan" value={permit.containmentPlan} />
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Gas Measurement Panel */}
      {showGasMonitoring && <GasMeasurementPanel permitId={permit.id} />}

      {/* Safety Route Back */}
      {permit.srbRequired === "yes" && (
        <SafetyRouteBack
          primaryRoute={permit.srbPrimaryRoute}
          secondaryRoute={permit.srbSecondaryRoute}
          assemblyPoint={permit.srbAssemblyPoint}
          emergencyContact={permit.srbEmergencyContact}
        />
      )}

      {/* Approval Workflow & Sign-offs */}
      <ApprovalWorkflow permitId={permit.id} permitStatus={permit.status} />
    </div>
  );
}
