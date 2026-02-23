import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const TASK_PREFIXES = ["SCN", "SRC", "DL", "NA"] as const;

const schema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  location: z.string().min(1, "Location is required"),
  shift: z.string().min(1, "Shift is required"),
  machineNumber: z.string().min(1, "Machine number is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: any) => void;
  defaultValues: {
    system: string;
    group: string;
    region: string;
    date: string;
    canSocialDistance: "yes" | "no";
  };
  editValues?: {
    taskName: string;
    location: string;
    shift: string;
    machineNumber: string;
  };
  knownValues: {
    machines: string[];
    locations: string[];
    shifts: string[];
  };
}

function ComboField({
  label,
  required,
  options,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [isCustom, setIsCustom] = useState(false);

  if (isCustom) {
    return (
      <div>
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          <Button type="button" variant="outline" size="sm" onClick={() => setIsCustom(false)}>
            List
          </Button>
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={(v) => {
        if (v === "__other__") {
          setIsCustom(true);
          onChange("");
        } else {
          onChange(v);
        }
      }}>
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
          <SelectItem value="__other__">+ Add new...</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function InitialDetailsStep({ onSubmit, defaultValues, editValues, knownValues }: Props) {
  const [taskPrefix, setTaskPrefix] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      taskName: editValues?.taskName || "",
      location: editValues?.location || "",
      shift: editValues?.shift || "",
      machineNumber: editValues?.machineNumber || "",
    },
  });

  const locationVal = watch("location");
  const shiftVal = watch("shift");
  const machineVal = watch("machineNumber");
  const taskNameVal = watch("taskName");

  const doSubmit = (data: FormData) => {
    // Compose full task name with prefix
    const fullTaskName = taskPrefix ? `${taskPrefix} - ${data.taskName}` : data.taskName;
    onSubmit({
      ...data,
      taskName: fullTaskName,
      group: defaultValues.group,
      system: defaultValues.system,
      region: defaultValues.region,
      date: defaultValues.date,
      canSocialDistance: defaultValues.canSocialDistance,
    });
  };

  return (
    <form onSubmit={handleSubmit(doSubmit)} className="space-y-5">
      {/* New ISP header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">New ISP</h1>
        <p className="text-sm text-muted-foreground">Fill in the task details to get started</p>
      </div>

      {/* Single cohesive form block */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">
            Task Name <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2 mt-1.5">
            <Select value={taskPrefix} onValueChange={setTaskPrefix}>
              <SelectTrigger className="w-[100px] shrink-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {TASK_PREFIXES.map(prefix => (
                  <SelectItem key={prefix} value={prefix}>{prefix}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              {taskPrefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  {taskPrefix} -&nbsp;
                </span>
              )}
              <Input
                {...register("taskName")}
                placeholder="e.g. Quarterly maintenance check"
                className={taskPrefix ? "pl-[70px]" : ""}
              />
            </div>
          </div>
          {errors.taskName && <p className="text-xs text-destructive mt-1">{errors.taskName.message}</p>}
          {taskPrefix && taskNameVal && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Full name: <span className="font-medium text-foreground">{taskPrefix} - {taskNameVal}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ComboField
            label="Shift"
            required
            options={knownValues.shifts}
            value={shiftVal}
            onChange={(v) => setValue("shift", v, { shouldValidate: true })}
            error={errors.shift?.message}
            placeholder="Select shift"
          />

          <ComboField
            label="Location"
            required
            options={knownValues.locations}
            value={locationVal}
            onChange={(v) => setValue("location", v, { shouldValidate: true })}
            error={errors.location?.message}
            placeholder="Select location"
          />

          <ComboField
            label="Machine No."
            required
            options={knownValues.machines}
            value={machineVal}
            onChange={(v) => setValue("machineNumber", v, { shouldValidate: true })}
            error={errors.machineNumber?.message}
            placeholder="Select machine"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          Next Step
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
