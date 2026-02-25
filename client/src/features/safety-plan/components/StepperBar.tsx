import { cn } from "@/lib/utils";
import { Check, Pencil, Shield } from "lucide-react";

const STEPS = [
  { n: 1, label: "Task Details" },
  { n: 2, label: "Safety Questions" },
  { n: 3, label: "Hazard ID" },
  { n: 4, label: "Sign Off" },
];

interface StepperBarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  planName?: string;
  planStatus?: string;
  prefilled?: { system: string; group: string; region: string; date: string };
  taskSummary?: { taskName: string; shift: string; location: string; machineNumber: string };
  onEditDetails?: () => void;
  onExit?: () => void;
}

export function StepperBar({ currentStep, completedSteps, onStepClick, prefilled, taskSummary, onEditDetails, onExit }: StepperBarProps) {
  return (
    <>
      {/* ── Mobile: horizontal stepper ── */}
      <div className="md:hidden flex border-b border-border bg-card">
        {STEPS.map((step) => {
          const done = completedSteps.includes(step.n);
          const active = currentStep === step.n;
          const clickable = done || active;

          return (
            <button
              key={step.n}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(step.n)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1.5 relative transition-colors font-medium",
                active ? "bg-primary/10 text-primary" : done ? "text-primary/60" : "text-muted-foreground/40",
                !clickable && "cursor-default"
              )}
            >
              <div className={cn(
                "absolute top-0 inset-x-0 h-0.5 transition-colors",
                active ? "bg-primary" : done ? "bg-primary/40" : "bg-transparent"
              )} />

              <span className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                active ? "bg-primary text-primary-foreground shadow-sm" : done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/40"
              )}>
                {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.n}
              </span>

              <span className="text-[10px] font-semibold">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: vertical sidebar — matches nav sidebar brand styling ── */}
      <div className="hidden md:flex w-56 shrink-0 flex-col bg-slate-800 text-white">
        {/* Header */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1 rounded-md bg-white/10">
              <Shield className="h-3.5 w-3.5 text-white/70" />
            </div>
            <span className="font-semibold text-sm">New ISP</span>
          </div>
          {prefilled && (
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-medium">{prefilled.system}</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-medium">{prefilled.group}</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 text-[10px] font-medium">{prefilled.date}</span>
            </div>
          )}
        </div>

        {/* Steps */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 mb-3">Progress</p>
          {STEPS.map((step) => {
            const done = completedSteps.includes(step.n);
            const active = currentStep === step.n;
            const clickable = done || active;

            return (
              <button
                key={step.n}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(step.n)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left font-medium",
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : clickable
                      ? "text-white/70 hover:bg-white/8 hover:text-white"
                      : "text-white/20 cursor-default"
                )}
              >
                <span className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all",
                  done && !active && "bg-emerald-500/80 text-white",
                  active && "bg-white text-slate-800",
                  !done && !active && "border-2 border-white/15 text-white/25"
                )}>
                  {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.n}
                </span>
                <span className="flex-1">{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Task summary */}
        {taskSummary && completedSteps.includes(1) && currentStep > 1 && (
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Task Info</p>
              {onEditDetails && (
                <button type="button" onClick={onEditDetails} className="text-white/30 hover:text-white transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-white/90 text-xs font-medium truncate">{taskSummary.taskName}</p>
              <p className="text-white/40 text-[10px] truncate">{taskSummary.shift} &middot; {taskSummary.location}</p>
              <p className="text-white/40 text-[10px] truncate">Mach: {taskSummary.machineNumber}</p>
            </div>
          </div>
        )}

        {/* Exit */}
        {onExit && (
          <div className="px-3 py-3 border-t border-white/10">
            <button type="button" onClick={onExit} className="w-full text-[11px] text-white/30 hover:text-red-400 text-left px-3 py-1 transition-colors">
              ✕ Exit
            </button>
          </div>
        )}
      </div>
    </>
  );
}
