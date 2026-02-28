import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { TabProps } from "./tab-props";

const WORK_TYPES = ["Hot Work", "Cold Work", "Electrical", "Working at Height", "Confined Space", "Mechanical"] as const;

export function PermitDetailsTab({ register, control, errors, onNext }: TabProps) {
  return (
    <div className="space-y-5 max-w-3xl">
      {/* Section 1 */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          1. General Information
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Date</Label>
            <Input type="date" {...register("date")} className="h-8 text-sm" />
            {errors.date && <p className="text-[10px] text-destructive">{errors.date.message}</p>}
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Work Type</Label>
            <Controller name="workType" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Requestor / Submitter</Label>
            <Input {...register("submitter")} placeholder="Full name" className="h-8 text-sm" />
            {errors.submitter && <p className="text-[10px] text-destructive">{errors.submitter.message}</p>}
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Requestor Phone</Label>
            <Input {...register("requestorPhone")} placeholder="Phone number" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Manager</Label>
            <Input {...register("manager")} placeholder="Full name" className="h-8 text-sm" />
            {errors.manager && <p className="text-[10px] text-destructive">{errors.manager.message}</p>}
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">PTW Service Order #</Label>
            <Input {...register("serviceOrderNumber")} placeholder="PTW-SO#" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Location</Label>
            <Input {...register("location")} placeholder="e.g. Building 3 – Fab Bay 7" className="h-8 text-sm" />
            {errors.location && <p className="text-[10px] text-destructive">{errors.location.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 3 */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          2. Procedure & Purpose
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Procedure Name</Label>
            <Input {...register("procedureName")} placeholder="Procedure(s) name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Description / Purpose of Entry</Label>
            <Textarea {...register("workDescription")} placeholder="Describe the work to be carried out / purpose of entry..." rows={2} className="text-sm min-h-0" />
            {errors.workDescription && <p className="text-[10px] text-destructive">{errors.workDescription.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 5 */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          3. Customer & Machine
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Customer & Fab</Label>
            <Input {...register("customerFab")} placeholder="Customer & Fab name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Machine Type</Label>
            <Input {...register("machineType")} placeholder="e.g. EUV, Source" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Machine Number</Label>
            <Input {...register("machineNumber")} placeholder="Machine #" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Customer Notified</Label>
            <Controller name="customerNotified" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Customer Contact Name</Label>
            <Input {...register("customerContactName")} placeholder="Contact name" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Customer Contact Phone</Label>
            <Input {...register("customerContactPhone")} placeholder="Phone number" className="h-8 text-sm" />
          </div>
        </div>
      </fieldset>

      {/* Schedule */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          4. Schedule & Duration
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs">Duration (hours)</Label>
            <Input {...register("activityDurationHours")} placeholder="e.g. 4" type="number" className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Multiple Shifts</Label>
            <Controller name="multipleShifts" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Start Date</Label>
            <Input type="date" {...register("expectedStartDate")} className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Start Time</Label>
            <Input type="time" {...register("expectedStartTime")} className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">End Date</Label>
            <Input type="date" {...register("expectedEndDate")} className="h-8 text-sm" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">End Time</Label>
            <Input type="time" {...register("expectedEndTime")} className="h-8 text-sm" />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end pt-1">
        <Button type="button" size="sm" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
