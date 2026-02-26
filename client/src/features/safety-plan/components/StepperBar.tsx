import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Task Details" },
  { n: 2, label: "Pre-task Assessment" },
  { n: 3, label: "Hazard ID" },
  { n: 4, label: "Sign Off" },
];

interface StepperBarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  variant?: "mobile" | "desktop";
  taskSummary?: { taskName: string; shift: string; location: string; machineNumber: string; system: string };
  onExit?: () => void;
}

export function StepperBar({ currentStep, completedSteps, onStepClick, variant = "desktop", taskSummary, onExit }: StepperBarProps) {
  if (variant === "mobile") {
    return (
      <div className="flex bg-white px-2 py-2">
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
                "flex-1 flex flex-col items-center justify-center gap-1.5 relative transition-colors",
                active ? "text-primary" : done ? "text-primary/70" : "text-slate-400",
                clickable ? "" : "cursor-default"
              )}
            >
              <div className={cn(
                "absolute top-0 inset-x-0 h-0.5 transition-colors",
                active ? "bg-primary" : done ? "bg-primary/50" : "bg-transparent"
              )} />

              <span className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border",
                active ? "bg-primary text-white border-primary" : done ? "bg-primary/10 text-primary border-primary/30" : "bg-slate-100 text-slate-400 border-slate-200"
              )}>
                {done && !active ? <Check className="h-3 w-3" strokeWidth={3} /> : step.n}
              </span>

              <span className={cn("text-[10px] font-medium text-center leading-tight", active ? "text-primary" : "")}>{step.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop: compact vertical stepper — no background
  return (
    <div className="w-44 shrink-0 flex flex-col">
      {/* Task info header */}
      {taskSummary?.taskName && (
        <div className="px-2 pb-3 mb-2 border-b border-slate-200/60">
          <p className="text-[13px] font-semibold text-slate-800 truncate">{taskSummary.taskName}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {taskSummary.shift && (
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-medium text-slate-600">
                Shift: {taskSummary.shift}
              </span>
            )}
            {taskSummary.location && (
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-medium text-slate-600">
                Location: {taskSummary.location}
              </span>
            )}
            {taskSummary.system && (
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-medium text-slate-600">
                System: {taskSummary.system}
              </span>
            )}
            {taskSummary.machineNumber && (
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-medium text-slate-600">
                Machine: {taskSummary.machineNumber}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
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
              "flex items-center gap-2.5 px-2 py-2 rounded-md text-[13px] transition-all text-left font-medium",
              active
                ? "bg-primary/8 text-primary"
                : clickable
                  ? "text-slate-500 hover:text-slate-800"
                  : "text-slate-300 cursor-default"
            )}
          >
            <span className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border transition-all",
              done && !active && "bg-primary/10 text-primary border-primary/25",
              active && "bg-primary text-white border-primary",
              !done && !active && "border-slate-200 text-slate-400"
            )}>
              {done && !active ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : step.n}
            </span>
            <span>{step.label}</span>
          </button>
        );
      })}

      {onExit && (
        <button type="button" onClick={onExit} className="text-[11px] text-slate-400 hover:text-red-500 text-left px-2 py-1.5 mt-1 transition-colors">
          ✕ Exit
        </button>
      )}
      </div>
    </div>
  );
}
