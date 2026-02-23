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
      <div className="md:hidden flex border-b border-border bg-muted/30">
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
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative transition-colors",
                active ? "bg-primary/5" : "",
                !clickable && "cursor-default"
              )}
            >
              {/* Top progress bar */}
              <div className={cn(
                "absolute top-0 inset-x-0 h-0.5 rounded-b-full transition-colors",
                active ? "bg-primary" : done ? "bg-primary/35" : "bg-transparent"
              )} />

              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : done
                    ? "bg-primary/15 text-primary"
                    : "border-2 border-muted-foreground/20 text-muted-foreground/30"
              )}>
                {done && !active ? <Check className="h-3 w-3" strokeWidth={3} /> : step.n}
              </span>

              <span className={cn(
                "text-[9px] font-medium leading-tight text-center whitespace-nowrap transition-colors",
                active ? "text-primary font-semibold" : done ? "text-muted-foreground/70" : "text-muted-foreground/35"
              )}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <div className="hidden md:flex w-56 shrink-0 flex-col bg-muted border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-primary/10">
              <Shield className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">New ISP</span>
          </div>
          {prefilled && (
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-primary/8 text-primary text-[10px] font-medium">{prefilled.system}</span>
              <span className="px-1.5 py-0.5 rounded bg-primary/8 text-primary text-[10px] font-medium">{prefilled.group}</span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">{prefilled.date}</span>
            </div>
          )}
        </div>

        {/* Steps */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-2 mb-2">Steps</p>
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
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                  active
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : clickable
                      ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                      : "text-muted-foreground/40 cursor-default"
                )}
              >
                <span className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  done && !active && "bg-primary text-primary-foreground",
                  active && "bg-primary-foreground text-primary border-0",
                  !done && !active && "border-2 border-muted-foreground/20 text-muted-foreground/30"
                )}>
                  {done && !active ? <Check className="h-3 w-3" strokeWidth={3} /> : step.n}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Task summary — shown after step 1 */}
        {taskSummary && completedSteps.includes(1) && currentStep > 1 && (
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Task Info</p>
              {onEditDetails && (
                <button type="button" onClick={onEditDetails} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-0.5 text-[11px]">
              <p className="text-foreground font-medium truncate">{taskSummary.taskName}</p>
              <p className="text-muted-foreground truncate">{taskSummary.shift} &middot; {taskSummary.location}</p>
              <p className="text-muted-foreground truncate">Machine: {taskSummary.machineNumber}</p>
            </div>
          </div>
        )}

        {/* Exit */}
        {onExit && (
          <div className="p-3 border-t border-border">
            <button type="button" onClick={onExit} className="w-full text-xs text-muted-foreground/50 hover:text-destructive text-left px-2 py-1 transition-colors">
              &times; Exit Record
            </button>
          </div>
        )}
      </div>
    </>
  );
}
