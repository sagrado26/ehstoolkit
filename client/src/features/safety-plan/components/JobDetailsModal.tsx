import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  group: z.string().min(1, "Please select a group"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  shift: z.enum(["Day", "Night", "Swing"]),
  machineNumber: z.string().min(1, "Machine number is required"),
  region: z.string().default("Europe - Ireland"),
  system: z.enum(["EUV", "DUV", "CSCM", "Trumph", "Others"]).default("Others"),
  canSocialDistance: z.enum(["yes", "no"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onSubmit: (data: FormData) => void;
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children, span2 }: { label: string; required?: boolean; error?: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <Label className="text-sm mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function JobDetailsModal({ open, onSubmit }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { region: "Europe - Ireland", system: "Others" },
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-lg">New Safety Plan</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the job details below. All required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Job Identification */}
          <FieldGroup title="Job Identification">
            <Field label="Task Name" required error={errors.taskName?.message} span2>
              <Input {...register("taskName")} placeholder="e.g. Quarterly maintenance check" />
            </Field>
            <Field label="Date" required error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </Field>
            <Field label="Shift" required>
              <Controller name="shift" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                  <SelectContent>
                    {["Day", "Night", "Swing"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </Field>
          </FieldGroup>

          {/* Section 2: Location & Equipment */}
          <FieldGroup title="Location & Equipment">
            <Field label="Location" required error={errors.location?.message}>
              <Input {...register("location")} placeholder="e.g. Bay 4 – Clean Room" />
            </Field>
            <Field label="Machine Number" required error={errors.machineNumber?.message}>
              <Input {...register("machineNumber")} placeholder="e.g. M-4021" />
            </Field>
            <Field label="Region">
              <Input {...register("region")} className="bg-muted/30" readOnly />
            </Field>
            <Field label="System">
              <Controller name="system" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["EUV", "DUV", "CSCM", "Trumph", "Others"].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </Field>
          </FieldGroup>

          {/* Section 3: Team & Conditions */}
          <FieldGroup title="Team & Conditions">
            <Field label="Group" required error={errors.group?.message}>
              <Controller name="group" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    {["Europe", "US", "ASIA", "TW", "Korea"].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </Field>
            <Field label="Can Social Distance?" required>
              <Controller name="canSocialDistance" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes — 2m spacing possible</SelectItem>
                    <SelectItem value="no">No — mitigation needed</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </Field>
          </FieldGroup>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <Button type="button" variant="ghost" size="sm">Cancel</Button>
          <Button type="submit" size="sm" onClick={handleSubmit(onSubmit)}>Create Safety Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
