import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { TabProps } from "./tab-props";

export function SafetyRouteBackTab({ register, control, onNext, onPrev }: TabProps) {
  return (
    <div className="space-y-4 max-w-3xl">
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3 w-full">
          10. Safety Route Back (SRB)
        </legend>
        <div className="space-y-3">
          <div className="space-y-0.5 max-w-[200px]">
            <Label className="text-xs">SRB Required?</Label>
            <Controller name="srbRequired" control={control} render={({ field }) => (
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
            <Label className="text-xs">Primary Evacuation Route</Label>
            <Textarea {...register("srbPrimaryRoute")} placeholder="Describe primary evacuation route..." rows={2} className="text-sm min-h-0" />
          </div>
          <div className="space-y-0.5">
            <Label className="text-xs">Secondary Evacuation Route</Label>
            <Textarea {...register("srbSecondaryRoute")} placeholder="Describe alternative route..." rows={2} className="text-sm min-h-0" />
          </div>
          <div className="space-y-3">
            <div className="space-y-0.5">
              <Label className="text-xs">Assembly Point</Label>
              <Input {...register("srbAssemblyPoint")} placeholder="e.g. Muster Point A" className="h-8 text-sm" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-xs">Emergency Contact</Label>
              <Input {...register("srbEmergencyContact")} placeholder="e.g. 555-0199" className="h-8 text-sm" />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
