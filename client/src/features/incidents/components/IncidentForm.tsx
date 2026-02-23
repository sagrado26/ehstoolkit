import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { IncidentFormData } from "../types";

const schema = z.object({
  date: z.string().min(1, "Required"),
  type: z.enum(["near-miss", "injury", "property-damage", "environmental"]),
  location: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  severity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  assignedInvestigator: z.string().min(1, "Required"),
  status: z.enum(["open", "investigating", "closed"]),
});

const SEVERITY_LABELS = ["", "Low", "Medium", "High", "Critical"];
const SEVERITY_COLORS = ["", "bg-green-100 text-green-700 border-green-200", "bg-yellow-100 text-yellow-700 border-yellow-200", "bg-orange-100 text-orange-700 border-orange-200", "bg-red-100 text-red-700 border-red-200"];

const STEPS = [
  { n: 1, label: "Incident Details" },
  { n: 2, label: "Triage" },
  { n: 3, label: "Investigation" },
  { n: 4, label: "Sign Off" },
];

interface Props {
  onSubmit: (data: IncidentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function IncidentForm({ onSubmit, onCancel, isLoading }: Props) {
  const [step, setStep] = useState(1);

  const { register, handleSubmit, control, trigger, formState: { errors } } = useForm<IncidentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: "", type: "near-miss", location: "", description: "",
      severity: 1, assignedInvestigator: "", status: "open",
    },
  });

  const advanceStep = async () => {
    const step1Fields: (keyof IncidentFormData)[] = ["date", "type", "location", "description"];
    const valid = await trigger(step1Fields);
    if (valid) setStep(s => Math.min(s + 1, 4) as any);
  };

  return (
    <div className="flex flex-col md:flex-row h-full md:min-h-[480px] border border-border rounded-lg overflow-hidden bg-card">
      {/* Mobile: horizontal step bar */}
      <div className="flex md:hidden items-center gap-1 px-4 py-3 border-b border-border bg-muted overflow-x-auto">
        {STEPS.map(s => {
          const active = s.n === step;
          const done = s.n < step;
          const clickable = s.n <= step;
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => clickable && setStep(s.n)}
              disabled={!clickable}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                active ? "bg-primary text-primary-foreground"
                  : done ? "bg-emerald-500/10 text-emerald-600"
                  : "text-muted-foreground/40"
              )}
            >
              <span className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                done && "bg-emerald-500 text-white",
                active && "bg-primary-foreground text-primary",
                !done && !active && "border-2 border-muted-foreground/20 text-muted-foreground/30"
              )}>
                {done ? "✓" : s.n}
              </span>
              {active && <span>{s.label}</span>}
            </button>
          );
        })}
        <button type="button" onClick={onCancel} className="ml-auto text-xs text-muted-foreground/50 hover:text-destructive whitespace-nowrap px-2">
          &times; Exit
        </button>
      </div>

      {/* Desktop: left steps panel */}
      <div className="hidden md:flex w-48 shrink-0 border-r border-border bg-muted/20 flex-col p-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Incident</p>
          <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            Draft
          </span>
        </div>

        <div className="space-y-1">
          {STEPS.map(s => (
            <button
              key={s.n}
              type="button"
              onClick={() => s.n <= step && setStep(s.n)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors text-left",
                s.n === step
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : s.n < step
                    ? "text-muted-foreground hover:text-foreground hover:bg-background/60 cursor-pointer"
                    : "text-muted-foreground/40 cursor-default"
              )}
            >
              <span className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                s.n === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : s.n < step
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-border text-muted-foreground"
              )}>
                {s.n < step ? "✓" : s.n}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right content panel */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
          <h2 className="text-base font-semibold">{STEPS.find(s => s.n === step)?.label}</h2>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="hidden sm:inline-flex">Cancel</Button>
            {step < 4 ? (
              <Button type="button" size="sm" onClick={advanceStep}>Next →</Button>
            ) : (
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? "Saving..." : "Submit Report"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Step 1: Incident Details */}
          {step === 1 && (
            <div className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Controller name="type" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="near-miss">Near Miss</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="property-damage">Property Damage</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label>Location</Label>
                  <Input {...register("location")} placeholder="e.g. Bay 4 – Forklift Zone" />
                  {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label>Description</Label>
                  <Textarea {...register("description")} placeholder="Describe what happened, when, and who was involved..." rows={4} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Triage (Severity) */}
          {step === 2 && (
            <div className="space-y-5 max-w-xl">
              <p className="text-sm text-muted-foreground">Assess the initial severity of this incident.</p>
              <div className="space-y-2">
                <Label>Severity Rating</Label>
                <Controller name="severity" control={control} render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([1, 2, 3, 4] as const).map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => field.onChange(n)}
                        className={cn(
                          "py-4 rounded-lg text-center border-2 transition-all",
                          field.value === n
                            ? SEVERITY_COLORS[n]
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <p className="text-2xl font-bold">{n}</p>
                        <p className="text-xs mt-1">{SEVERITY_LABELS[n]}</p>
                      </button>
                    ))}
                  </div>
                )} />
              </div>
            </div>
          )}

          {/* Step 3: Investigation */}
          {step === 3 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-sm text-muted-foreground">Assign an investigator to follow up on this incident.</p>
              <div className="space-y-1">
                <Label>Assigned Investigator</Label>
                <Input {...register("assignedInvestigator")} placeholder="Full name" />
                {errors.assignedInvestigator && <p className="text-xs text-destructive">{errors.assignedInvestigator.message}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Sign Off */}
          {step === 4 && (
            <div className="space-y-4 max-w-xl">
              <p className="text-sm text-muted-foreground">Set the initial status and submit the incident report.</p>
              <div className="space-y-1">
                <Label>Status</Label>
                <Controller name="status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
          )}
        </div>

        {step > 1 && (
          <div className="px-4 sm:px-6 pb-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>← Back</Button>
          </div>
        )}
      </form>
    </div>
  );
}
