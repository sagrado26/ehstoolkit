import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { TabProps } from "./tab-props";
import type { SpaceIdentification, CommunicationMethod } from "../../types";

const SPACE_OPTIONS: { key: keyof SpaceIdentification; label: string }[] = [
  { key: "sourceVessel", label: "Source-Vessel" },
  { key: "driveLaserCompartments", label: "Drive Laser compartments (full body)" },
  { key: "scannerSourceArea", label: "Scanner Source area (SISO), service area" },
  { key: "areaUnderSourceSBF", label: "Area under the Source in the SBF (EXE)" },
];

const COMM_OPTIONS: { key: keyof Omit<CommunicationMethod, "otherDescription">; label: string }[] = [
  { key: "verbalVisual", label: "Verbal / Visual" },
  { key: "radio", label: "Radio" },
  { key: "other", label: "Other" },
];

function InlineCheck({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0",
      checked ? "bg-brand border-brand text-white" : "border-border hover:border-brand/50 bg-background"
    )}>
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

export function CSSpaceIdentificationTab({ register, control, watch, setValue, onNext, onPrev }: TabProps) {
  const spaceId = watch("spaceIdentification");
  const commMethod = watch("communicationMethod");

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Space Identification */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          5. Permit Required Confined Space
        </legend>
        <div className="border border-border rounded-md overflow-hidden">
          {SPACE_OPTIONS.map(({ key, label }, idx) => {
            const checked = spaceId?.[key] ?? false;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue("spaceIdentification", { ...spaceId, [key]: !checked }, { shouldDirty: true })}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                  idx < SPACE_OPTIONS.length - 1 && "border-b border-border",
                  checked ? "bg-brand/[0.03]" : "hover:bg-muted/20"
                )}
              >
                <InlineCheck checked={!!checked} onClick={() => { }} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 space-y-0.5">
          <Label className="text-xs">Other (specify)</Label>
          <Input
            value={spaceId?.other ?? ""}
            onChange={(e) => setValue("spaceIdentification", { ...spaceId, other: e.target.value }, { shouldDirty: true })}
            placeholder="Other confined space..."
            className="h-8 text-sm"
          />
        </div>
      </fieldset>

      {/* Personnel */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          6. Personnel
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Entry Supervisor</Label>
            <Input {...register("entrySupervisor")} placeholder="Full name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Standby Person / Attendant</Label>
            <Input {...register("standbyPerson")} placeholder="Full name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Attendant(s)</Label>
            <Input {...register("attendants")} placeholder="Name(s)" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Entrant(s)</Label>
            <Input {...register("entrants")} placeholder="Name(s)" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Atmospheric Tester</Label>
            <Input {...register("atmosphericTester")} placeholder="Name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Initial O₂ Level (%)</Label>
            <Input {...register("o2Level")} placeholder="e.g. 20.9" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Nitrogen Purge Required?</Label>
            <Controller name="nitrogenPurge" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
        </div>
      </fieldset>

      {/* Communication */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          Communication Method (Entrant ↔ Attendant)
        </legend>
        <div className="border border-border rounded-md overflow-hidden">
          {COMM_OPTIONS.map(({ key, label }, idx) => {
            const checked = commMethod?.[key] ?? false;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue("communicationMethod", { ...commMethod, [key]: !checked }, { shouldDirty: true })}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                  idx < COMM_OPTIONS.length - 1 && "border-b border-border",
                  checked ? "bg-brand/[0.03]" : "hover:bg-muted/20"
                )}
              >
                <InlineCheck checked={checked} onClick={() => { }} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {commMethod?.other && (
          <div className="mt-2 space-y-0.5">
            <Label className="text-xs">Other communication method</Label>
            <Input
              value={commMethod?.otherDescription ?? ""}
              onChange={(e) => setValue("communicationMethod", { ...commMethod, otherDescription: e.target.value }, { shouldDirty: true })}
              placeholder="Specify..."
              className="h-8 text-sm"
            />
          </div>
        )}
        <div className="mt-3 space-y-0.5">
          <Label className="text-xs">Extraction Plan Reviewed</Label>
          <Controller name="extractionPlanReviewed" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </fieldset>

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
