import { cn } from "@/lib/utils";
import { Check, ShieldAlert } from "lucide-react";
import type { SRBStep } from "../types";

const STEPS: { n: SRBStep; label: string }[] = [
  { n: 1, label: "Pre-SRB Questions" },
  { n: 2, label: "Original Hazards" },
  { n: 3, label: "Reassessment" },
  { n: 4, label: "Acknowledgements" },
  { n: 5, label: "Signatures" },
  { n: 6, label: "ISO Documentation" },
];

interface Props {
  currentStep: SRBStep;
  completedSteps: SRBStep[];
  onStepClick: (step: SRBStep) => void;
  serviceOrderNumber?: string;
  onExit?: () => void;
}

export function SRBStepperBar({ currentStep, completedSteps, onStepClick, serviceOrderNumber, onExit }: Props) {
  return (
    <>
      {/* Mobile: horizontal stepper */}
      <div className="md:hidden flex border-b border-border bg-card overflow-x-auto">
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
                "flex-1 min-w-[70px] flex flex-col items-center justify-center py-3 gap-1.5 relative transition-colors font-medium",
                active ? "bg-primary/10 text-primary" : done ? "text-primary/60" : "text-muted-foreground/40",
                !clickable && "cursor-default"
              )}
            >
              <div className={cn(
                "absolute top-0 inset-x-0 h-0.5 transition-colors",
                active ? "bg-primary" : done ? "bg-primary/40" : "bg-transparent"
              )} />
              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                active ? "bg-primary text-primary-foreground shadow-sm" : done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/40"
              )}>
                {done && !active ? <Check className="h-3 w-3" strokeWidth={3} /> : step.n}
              </span>
              <span className="text-[9px] font-semibold leading-tight text-center">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: vertical sidebar */}
      <div className="hidden md:flex w-56 shrink-0 flex-col bg-slate-800 text-white">
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1 rounded-md bg-red-500/20">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            </div>
            <span className="font-semibold text-sm">Safety Review Board</span>
          </div>
          {serviceOrderNumber && (
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-medium">
              SO: {serviceOrderNumber}
            </span>
          )}
        </div>

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
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left font-medium",
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : clickable
                      ? "text-white/70 hover:bg-white/8 hover:text-white"
                      : "text-white/20 cursor-default"
                )}
              >
                <span className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all",
                  done && !active && "bg-emerald-500/80 text-white",
                  active && "bg-white text-slate-800",
                  !done && !active && "border-2 border-white/15 text-white/25"
                )}>
                  {done && !active ? <Check className="h-3 w-3" strokeWidth={3} /> : step.n}
                </span>
                <span className="flex-1 text-xs">{step.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/10">
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Mandatory</p>
            <p className="text-[10px] text-white/60 leading-relaxed">All risks must be reduced to LOW before activity can start.</p>
          </div>
        </div>

        {onExit && (
          <div className="px-3 py-3 border-t border-white/10">
            <button type="button" onClick={onExit} className="w-full text-[11px] text-white/30 hover:text-red-400 text-left px-3 py-1 transition-colors">
              ✕ Exit SRB
            </button>
          </div>
        )}
      </div>
    </>
  );
}
