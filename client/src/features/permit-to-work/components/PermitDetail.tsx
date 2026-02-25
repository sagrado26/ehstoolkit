import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, FileText, MapPin, User, Calendar, Briefcase, Box, AlertTriangle, FlaskConical } from "lucide-react";
import { GasMeasurementPanel } from "./GasMeasurementPanel";
import { ApprovalWorkflow } from "./ApprovalWorkflow";
import { SafetyRouteBack } from "./SafetyRouteBack";

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

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-bold">PTW-{String(permit.id).padStart(4, "0")}</h1>
              <Badge variant="outline" className={cn("text-xs", STATUS_STYLES[permit.status])}>
                {permit.status === "approved" ? "Issued" : permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
              </Badge>
              {typeConfig && (
                <Badge variant="outline" className="text-xs">
                  {typeConfig.label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{permit.workType} — {permit.location}</p>
          </div>
        </div>
      </div>

      {/* Permit Info Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Permit Details
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Date</p>
              <p className="text-sm flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {permit.date}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Submitter</p>
              <p className="text-sm flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {permit.submitter}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Manager</p>
              <p className="text-sm flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {permit.manager}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Location</p>
              <p className="text-sm flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {permit.location}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
            <p className="text-sm leading-relaxed">{permit.workDescription}</p>
          </div>

          {/* Type-specific info */}
          {permit.permitType === "confined-space" && (permit.o2Level || permit.entrySupervisor) && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand mb-3 flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5" /> Confined Space Details
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {permit.o2Level && <div><p className="text-[10px] text-muted-foreground">Initial O₂</p><p className="text-sm font-mono">{permit.o2Level}%</p></div>}
                {permit.nitrogenPurge && <div><p className="text-[10px] text-muted-foreground">N₂ Purge</p><p className="text-sm">{permit.nitrogenPurge === "yes" ? "Required" : "N/A"}</p></div>}
                {permit.entrySupervisor && <div><p className="text-[10px] text-muted-foreground">Entry Supervisor</p><p className="text-sm">{permit.entrySupervisor}</p></div>}
                {permit.standbyPerson && <div><p className="text-[10px] text-muted-foreground">Standby Person</p><p className="text-sm">{permit.standbyPerson}</p></div>}
              </div>
            </div>
          )}

          {permit.permitType === "hazardous-space" && permit.hazardAssessment && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Hazardous Space Details
              </p>
              <div className="space-y-2">
                {permit.hazardAssessment && <div><p className="text-[10px] text-muted-foreground">Hazard Assessment</p><p className="text-sm">{permit.hazardAssessment}</p></div>}
                {permit.respiratoryProtection && <div><p className="text-[10px] text-muted-foreground">Respiratory Protection</p><p className="text-sm">{permit.respiratoryProtection}</p></div>}
                {permit.isolationMethods && <div><p className="text-[10px] text-muted-foreground">Isolation Methods</p><p className="text-sm">{permit.isolationMethods}</p></div>}
              </div>
            </div>
          )}

          {permit.permitType === "hazardous-chemicals" && permit.chemicalInventory && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" /> Hazardous Chemicals Details
              </p>
              <div className="space-y-2">
                {permit.chemicalInventory && <div><p className="text-[10px] text-muted-foreground">Chemical Inventory</p><p className="text-sm">{permit.chemicalInventory}</p></div>}
                {permit.sdsDocuments && <div><p className="text-[10px] text-muted-foreground">SDS Documents</p><p className="text-sm">{permit.sdsDocuments}</p></div>}
                {permit.ppeRequirements && <div><p className="text-[10px] text-muted-foreground">PPE Requirements</p><p className="text-sm">{permit.ppeRequirements}</p></div>}
                {permit.containmentPlan && <div><p className="text-[10px] text-muted-foreground">Containment Plan</p><p className="text-sm">{permit.containmentPlan}</p></div>}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Gas Measurement Panel - for confined/hazardous space */}
      {showGasMonitoring && (
        <GasMeasurementPanel permitId={permit.id} />
      )}

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
