import { cn } from "@/lib/utils";
import { Check, Pencil, Shield, X } from "lucide-react";

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
      {/* ── Mobile: full-width horizontal stepper ── */}
      <div className="md:hidden flex border-b-2 border-slate-800 bg-muted/40">
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
              {/* Top progress bar */}
              <div className={cn(
                "absolute top-0 inset-x-0 h-1 rounded-b-full transition-colors",
                active ? "bg-primary" : done ? "bg-primary/50" : "bg-transparent"
              )} />

              {/* Step indicator */}
              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                active ? "bg-primary text-white shadow-md" : done ? "bg-primary/60 text-white" : "bg-muted-foreground/20 text-muted-foreground/30"
              )}>
                {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.n}
              </span>

              {/* Label */}
              <span className="text-[10px] font-semibold">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <div className="hidden md:flex w-56 shrink-0 flex-col bg-muted border-r-2 border-slate-800">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-0.5 rounded bg-primary/10">
              <Shield className="h-3 w-3 text-primary" />
            </div>
            <span className="font-semibold text-xs text-foreground">New ISP</span>
          </div>
          {prefilled && (
            <div className="flex flex-wrap gap-0.5">
              <span className="px-1 py-0.5 rounded bg-primary/8 text-primary text-[9px] font-medium">{prefilled.system}</span>
              <span className="px-1 py-0.5 rounded bg-primary/8 text-primary text-[9px] font-medium">{prefilled.group}</span>
              <span className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-medium">{prefilled.date}</span>
            </div>
          )}
        </div>

        {/* Steps */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-3 mb-3">Progress</p>
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
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all text-left font-medium",
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : clickable
                      ? "text-foreground hover:bg-muted/70 hover:text-primary"
                      : "text-muted-foreground/30 cursor-default"
                )}
              >
                <span className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all",
                  done && !active && "bg-primary/70 text-primary-foreground",
                  active && "bg-white text-primary scale-110",
                  !done && !active && "border-2 border-muted-foreground/20 text-muted-foreground/40"
                )}>
                  {done && !active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.n}
                </span>
                <span className="flex-1">{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Task summary — shown after step 1 */}
        {taskSummary && completedSteps.includes(1) && currentStep > 1 && (
          <div className="px-3 py-2 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/40">Task Info</p>
              {onEditDetails && (
                <button type="button" onClick={onEditDetails} className="text-muted-foreground/30 hover:text-foreground transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-0.5 text-[10px]">
              <p className="text-foreground font-medium truncate">{taskSummary.taskName}</p>
              <p className="text-muted-foreground/70 truncate text-[9px]">{taskSummary.shift} &middot; {taskSummary.location}</p>
              <p className="text-muted-foreground/70 truncate text-[9px]">Mach: {taskSummary.machineNumber}</p>
            </div>
          </div>
        )}

        {/* Exit */}
        {onExit && (
          <div className="p-2 border-t border-border">
            <button type="button" onClick={onExit} className="w-full text-[10px] text-muted-foreground/40 hover:text-destructive text-left px-2 py-1 transition-colors">
              &times; Exit
            </button>
          </div>
        )}
      </div>
    </>
  );
}
