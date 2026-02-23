import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CraneInspectionFormData } from "../types";

const schema = z.object({
  inspector: z.string().min(1, "Required"),
  buddyInspector: z.string().min(1, "Required"),
  bay: z.string().min(1, "Required"),
  machine: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  q1: z.enum(["yes", "no"]),
  q2: z.enum(["yes", "no"]),
  q3: z.enum(["yes", "no"]),
  status: z.enum(["draft", "submitted"]),
});

const QUESTIONS = [
  { key: "q1" as const, label: "Pre-use inspection checklist completed" },
  { key: "q2" as const, label: "All safety devices operational" },
  { key: "q3" as const, label: "Load chart visible and within limits" },
];

interface Props {
  onSubmit: (data: CraneInspectionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CraneInspectionForm({ onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<CraneInspectionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      inspector: "", buddyInspector: "", bay: "", machine: "", date: "",
      q1: "no", q2: "no", q3: "no", status: "draft",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Inspector</Label>
          <Input {...register("inspector")} placeholder="Name" />
          {errors.inspector && <p className="text-xs text-destructive">{errors.inspector.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Buddy Inspector</Label>
          <Input {...register("buddyInspector")} placeholder="Name" />
          {errors.buddyInspector && <p className="text-xs text-destructive">{errors.buddyInspector.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Bay</Label>
          <Input {...register("bay")} placeholder="e.g. Bay 3" />
          {errors.bay && <p className="text-xs text-destructive">{errors.bay.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Machine</Label>
          <Input {...register("machine")} placeholder="e.g. Crane A" />
          {errors.machine && <p className="text-xs text-destructive">{errors.machine.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Date</Label>
          <Input type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Controller name="status" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium">Inspection Checklist</p>
        {QUESTIONS.map(({ key, label }) => (
          <Controller key={key} name={key} control={control} render={({ field }) => (
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <Label className="text-sm font-normal cursor-pointer">{label}</Label>
              <Switch
                checked={field.value === "yes"}
                onCheckedChange={checked => field.onChange(checked ? "yes" : "no")}
              />
            </div>
          )} />
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Inspection"}</Button>
      </div>
    </form>
  );
}
