import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Shield, CheckCircle2, Box, AlertTriangle, FlaskConical, Route, Wrench, Siren, ShieldCheck, Printer } from "lucide-react";
import type { PermitFormData, PermitTab } from "../types";
import { permitFormSchema } from "../permit-schema";
import {
  DEFAULT_SPACE_IDENTIFICATION,
  DEFAULT_COMMUNICATION_METHOD,
  DEFAULT_PHYSICAL_HAZARDS,
  DEFAULT_ATMOSPHERIC_HAZARDS,
  DEFAULT_TOOLS_CHECKLIST,
  DEFAULT_EXTRACTION_SITUATIONS,
  DEFAULT_EXTRACTION_METHODS,
  DEFAULT_EXTRACTION_EQUIPMENT,
  DEFAULT_MEDICAL_EQUIPMENT,
  DEFAULT_ENHANCED_SIGN_OFF,
} from "../confined-space-constants";

// Tab components
import { PermitDetailsTab } from "./tabs/PermitDetailsTab";
import { SafetyPrecautionsTab } from "./tabs/SafetyPrecautionsTab";
import { CSSpaceIdentificationTab } from "./tabs/CSSpaceIdentificationTab";
import { CSHazardsControlsTab } from "./tabs/CSHazardsControlsTab";
import { CSToolsEquipmentTab } from "./tabs/CSToolsEquipmentTab";
import { CSEmergencyPlanTab } from "./tabs/CSEmergencyPlanTab";
import { SafetyRouteBackTab } from "./tabs/SafetyRouteBackTab";
import { AuthoritySignOffTab } from "./tabs/AuthoritySignOffTab";

const PERMIT_TYPE_CONFIG: Record<string, { label: string; icon: typeof Box; color: string }> = {
  "confined-space": { label: "Confined Space", icon: Box, color: "text-brand" },
  "hazardous-space": { label: "Hazardous Space", icon: AlertTriangle, color: "text-amber-600" },
  "hazardous-chemicals": { label: "Hazardous Chemicals", icon: FlaskConical, color: "text-red-600" },
};

interface Props {
  onSubmit: (data: PermitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  permitType?: string;
}

export function PermitForm({ onSubmit, onCancel, isLoading, permitType }: Props) {
  const isConfinedSpace = permitType === "confined-space";
  const hasTypeSpecific = permitType && permitType !== "general" && PERMIT_TYPE_CONFIG[permitType];

  const allTabs: { id: PermitTab; label: string; icon: typeof FileText }[] = [
    { id: "details", label: "Permit Details", icon: FileText },
    { id: "precautions", label: "Safety Precautions", icon: Shield },
    ...(isConfinedSpace
      ? [
          { id: "cs-space" as PermitTab, label: "Space & Personnel", icon: Box },
          { id: "cs-hazards" as PermitTab, label: "Hazards & Controls", icon: AlertTriangle },
          { id: "cs-tools" as PermitTab, label: "Tools & Equipment", icon: Wrench },
          { id: "cs-emergency" as PermitTab, label: "Emergency Plan", icon: Siren },
        ]
      : hasTypeSpecific && !isConfinedSpace
        ? [{ id: "type-specific" as PermitTab, label: PERMIT_TYPE_CONFIG[permitType]?.label ?? "Type Details", icon: PERMIT_TYPE_CONFIG[permitType]?.icon ?? Box }]
        : []),
    { id: "srb", label: "Safety Route Back", icon: Route },
    { id: "authority", label: "Sign-off", icon: isConfinedSpace ? ShieldCheck : CheckCircle2 },
  ];

  const [activeTab, setActiveTab] = useState<PermitTab>("details");
  const workTypeDefault = permitType === "confined-space" ? "Confined Space" as const : "Cold Work" as const;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PermitFormData>({
    resolver: zodResolver(permitFormSchema),
    defaultValues: {
      date: "", submitter: "", manager: "", location: "",
      workType: workTypeDefault, permitType: (permitType ?? "general") as PermitFormData["permitType"],
      workDescription: "",
      spq1: "no", spq2: "no", spq3: "no", spq4: "no", spq5: "no",
      authorityName: "", status: "draft",
      o2Level: "", nitrogenPurge: "", entrySupervisor: "", standbyPerson: "",
      hazardAssessment: "", respiratoryProtection: "", isolationMethods: "",
      chemicalInventory: "", sdsDocuments: "", ppeRequirements: "", containmentPlan: "",
      srbRequired: "no", srbPrimaryRoute: "", srbSecondaryRoute: "", srbAssemblyPoint: "", srbEmergencyContact: "",
      requestorPhone: "", serviceOrderNumber: "", procedureName: "",
      customerFab: "", machineType: "", machineNumber: "",
      customerNotified: "no", customerContactName: "", customerContactPhone: "",
      activityDurationHours: "", expectedStartDate: "", expectedStartTime: "",
      expectedEndDate: "", expectedEndTime: "", multipleShifts: "no",
      spaceIdentification: DEFAULT_SPACE_IDENTIFICATION,
      attendants: "", entrants: "", atmosphericTester: "",
      communicationMethod: DEFAULT_COMMUNICATION_METHOD,
      extractionPlanReviewed: "no",
      physicalHazards: DEFAULT_PHYSICAL_HAZARDS,
      atmosphericHazards: DEFAULT_ATMOSPHERIC_HAZARDS,
      toolsChecklist: DEFAULT_TOOLS_CHECKLIST,
      ertContactInfo: "",
      extractionSituations: DEFAULT_EXTRACTION_SITUATIONS,
      extractionMethods: DEFAULT_EXTRACTION_METHODS,
      extractionEquipment: DEFAULT_EXTRACTION_EQUIPMENT,
      medicalEquipment: DEFAULT_MEDICAL_EQUIPMENT,
      enhancedSignOff: DEFAULT_ENHANCED_SIGN_OFF,
    },
  });

  const status = watch("status");
  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
  };

  const currentTabIdx = allTabs.findIndex(t => t.id === activeTab);
  const goNext = () => { if (currentTabIdx < allTabs.length - 1) setActiveTab(allTabs[currentTabIdx + 1].id); };
  const goPrev = () => { if (currentTabIdx > 0) setActiveTab(allTabs[currentTabIdx - 1].id); };

  const tabProps = { control, register, errors, watch, setValue, onNext: goNext, onPrev: currentTabIdx > 0 ? goPrev : undefined };

  return (
    <div className="flex flex-col md:flex-row h-full md:min-h-[560px] border border-border rounded-lg overflow-hidden bg-card print:border-0 print:rounded-none">
      {/* Mobile: horizontal tab bar */}
      <div className="flex md:hidden items-center gap-1 px-3 py-2 border-b border-border bg-muted/50 overflow-x-auto">
        {allTabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors",
                isActive ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted"
              )}>
              <span className={cn(
                "h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                isActive ? "bg-white/20 text-white" : "border border-muted-foreground/20 text-muted-foreground/40"
              )}>{idx + 1}</span>
              {isActive && <span>{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Desktop: left sidebar — light theme */}
      <div className="hidden md:flex w-52 shrink-0 border-r border-border bg-muted/30 flex-col print:hidden">
        <div className="px-3 py-3 border-b border-border">
          <p className="text-xs font-semibold text-foreground">Permit to Work</p>
          {hasTypeSpecific && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{PERMIT_TYPE_CONFIG[permitType!].label}</p>
          )}
          <span className={cn("inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wide", statusColors[status])}>
            {status}
          </span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {allTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors text-left",
                  isActive
                    ? "bg-brand/10 text-brand font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <span className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border",
                  isActive
                    ? "border-brand bg-brand text-white"
                    : "border-border text-muted-foreground/50"
                )}>{idx + 1}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          <button type="button" onClick={onCancel} className="w-full text-[11px] text-muted-foreground hover:text-foreground text-left px-2 py-1 transition-colors">
            Exit Record
          </button>
        </div>
      </div>

      {/* Main content */}
      <form onSubmit={handleSubmit((data) => onSubmit(data as PermitFormData))} className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">{currentTabIdx + 1}/{allTabs.length}</span>
            <h2 className="text-sm font-semibold">{allTabs.find(t => t.id === activeTab)?.label}</h2>
          </div>
          <div className="flex gap-1.5">
            <Button type="button" variant="ghost" size="sm" onClick={() => window.print()} className="h-7 px-2 text-xs gap-1 hidden sm:inline-flex">
              <Printer className="h-3 w-3" /> Print
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-7 px-2 text-xs hidden sm:inline-flex">Exit</Button>
            <Button type="submit" size="sm" disabled={isLoading} className="h-7 px-3 text-xs">{isLoading ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === "details" && <PermitDetailsTab {...tabProps} />}
          {activeTab === "precautions" && <SafetyPrecautionsTab {...tabProps} />}
          {activeTab === "cs-space" && <CSSpaceIdentificationTab {...tabProps} />}
          {activeTab === "cs-hazards" && <CSHazardsControlsTab {...tabProps} />}
          {activeTab === "cs-tools" && <CSToolsEquipmentTab {...tabProps} />}
          {activeTab === "cs-emergency" && <CSEmergencyPlanTab {...tabProps} />}

          {activeTab === "type-specific" && permitType === "hazardous-space" && (
            <div className="space-y-4 max-w-3xl">
              <fieldset>
                <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
                  Hazardous Space Requirements
                </legend>
                <div className="space-y-3">
                  <div className="space-y-0.5"><label className="text-xs font-medium">Hazard Assessment</label><textarea {...register("hazardAssessment")} placeholder="Describe identified hazards..." rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-0" /></div>
                  <div className="space-y-0.5"><label className="text-xs font-medium">Respiratory Protection</label><input {...register("respiratoryProtection")} placeholder="e.g. SCBA" className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div className="space-y-0.5"><label className="text-xs font-medium">Isolation Methods</label><textarea {...register("isolationMethods")} placeholder="Describe energy isolation..." rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-0" /></div>
                </div>
              </fieldset>
              <div className="flex justify-between pt-1">
                <Button type="button" variant="outline" size="sm" onClick={goPrev}>&larr; Back</Button>
                <Button type="button" size="sm" onClick={goNext}>Next &rarr;</Button>
              </div>
            </div>
          )}

          {activeTab === "type-specific" && permitType === "hazardous-chemicals" && (
            <div className="space-y-4 max-w-3xl">
              <fieldset>
                <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
                  Hazardous Chemicals Requirements
                </legend>
                <div className="space-y-3">
                  <div className="space-y-0.5"><label className="text-xs font-medium">Chemical Inventory</label><textarea {...register("chemicalInventory")} placeholder="List all chemicals..." rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-0" /></div>
                  <div className="space-y-0.5"><label className="text-xs font-medium">SDS Documents</label><input {...register("sdsDocuments")} placeholder="Reference SDS document IDs" className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div className="space-y-0.5"><label className="text-xs font-medium">PPE Requirements</label><textarea {...register("ppeRequirements")} placeholder="Specify all required PPE..." rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-0" /></div>
                  <div className="space-y-0.5"><label className="text-xs font-medium">Containment Plan</label><textarea {...register("containmentPlan")} placeholder="Describe spill containment..." rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-0" /></div>
                </div>
              </fieldset>
              <div className="flex justify-between pt-1">
                <Button type="button" variant="outline" size="sm" onClick={goPrev}>&larr; Back</Button>
                <Button type="button" size="sm" onClick={goNext}>Next &rarr;</Button>
              </div>
            </div>
          )}

          {activeTab === "srb" && <SafetyRouteBackTab {...tabProps} />}
          {activeTab === "authority" && <AuthoritySignOffTab {...tabProps} isLoading={isLoading} />}
        </div>
      </form>
    </div>
  );
}
