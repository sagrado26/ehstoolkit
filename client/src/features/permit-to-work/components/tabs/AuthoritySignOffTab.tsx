import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle2 } from "lucide-react";
import { SignatureCapture } from "../SignatureCapture";
import type { TabProps } from "./tab-props";
import type { EnhancedSignOff } from "../../types";

export function AuthoritySignOffTab({ register, control, watch, setValue, onPrev, isLoading }: TabProps & { isLoading?: boolean }) {
  const enhancedSignOff = watch("enhancedSignOff") as EnhancedSignOff;
  const [showEhsSig, setShowEhsSig] = useState(false);
  const [showMgrSig, setShowMgrSig] = useState(false);

  const updateSignOff = (field: keyof EnhancedSignOff, value: string) => {
    setValue("enhancedSignOff", { ...enhancedSignOff, [field]: value }, { shouldDirty: true });
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Permit Status */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          11. Authority & Sign-off
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Authorised By</Label>
            <Input {...register("authorityName")} placeholder="Name of person authorising" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Permit Status</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved / Issued</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
        </div>
      </fieldset>

      {/* EHS Specialist */}
      <fieldset className="border border-border rounded-md p-3 space-y-3">
        <legend className="text-xs font-semibold px-1">11a. Local EHS Specialist / EUV Safety Engineer</legend>
        <p className="text-[11px] text-muted-foreground">Safety mitigation reviewed and approved.</p>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Name</Label>
            <Input
              value={enhancedSignOff?.ehsSpecialistName ?? ""}
              onChange={(e) => updateSignOff("ehsSpecialistName", e.target.value)}
              placeholder="EHS Specialist name"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Date</Label>
            <Input
              type="date"
              value={enhancedSignOff?.ehsSpecialistDate ?? ""}
              onChange={(e) => updateSignOff("ehsSpecialistDate", e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        {enhancedSignOff?.ehsSpecialistSignature ? (
          <div className="flex items-center gap-3 p-2 border border-green-200 dark:border-green-500/20 rounded bg-green-50/50 dark:bg-green-500/5">
            <img src={enhancedSignOff.ehsSpecialistSignature} alt="EHS Signature" className="h-12 object-contain" />
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <Button type="button" variant="ghost" size="sm" className="text-xs ml-auto h-7"
              onClick={() => { updateSignOff("ehsSpecialistSignature", ""); setShowEhsSig(true); }}>
              Re-sign
            </Button>
          </div>
        ) : showEhsSig ? (
          <SignatureCapture
            label="EHS Specialist Signature"
            onCapture={(data) => { updateSignOff("ehsSpecialistSignature", data); setShowEhsSig(false); }}
          />
        ) : (
          <Button type="button" variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setShowEhsSig(true)}>
            <PenTool className="h-3 w-3" /> Add Signature
          </Button>
        )}
      </fieldset>

      {/* Manager */}
      <fieldset className="border border-border rounded-md p-3 space-y-3">
        <legend className="text-xs font-semibold px-1">11b. Local Responsible Manager</legend>
        <p className="text-[11px] text-muted-foreground">Task signed off — activity can be started.</p>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Name</Label>
            <Input
              value={enhancedSignOff?.managerName ?? ""}
              onChange={(e) => updateSignOff("managerName", e.target.value)}
              placeholder="Manager name"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Date</Label>
            <Input
              type="date"
              value={enhancedSignOff?.managerDate ?? ""}
              onChange={(e) => updateSignOff("managerDate", e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        {enhancedSignOff?.managerSignature ? (
          <div className="flex items-center gap-3 p-2 border border-green-200 dark:border-green-500/20 rounded bg-green-50/50 dark:bg-green-500/5">
            <img src={enhancedSignOff.managerSignature} alt="Manager Signature" className="h-12 object-contain" />
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <Button type="button" variant="ghost" size="sm" className="text-xs ml-auto h-7"
              onClick={() => { updateSignOff("managerSignature", ""); setShowMgrSig(true); }}>
              Re-sign
            </Button>
          </div>
        ) : showMgrSig ? (
          <SignatureCapture
            label="Manager Signature"
            onCapture={(data) => { updateSignOff("managerSignature", data); setShowMgrSig(false); }}
          />
        ) : (
          <Button type="button" variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setShowMgrSig(true)}>
            <PenTool className="h-3 w-3" /> Add Signature
          </Button>
        )}
      </fieldset>

      <p className="text-[11px] text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded px-3 py-2">
        All safety risks must be mitigated, reviewed/approved by local EHS, and signed off by local responsible manager before activity can be started.
      </p>

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="submit" size="sm" disabled={isLoading} className="min-w-[100px] ml-auto">
          {isLoading ? "Saving..." : "Issue Permit"}
        </Button>
      </div>
    </div>
  );
}
