import { cn } from "@/lib/utils";
import { Shield, Check } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const QUESTIONS = [
  { key: "q1_specializedTraining", label: "Specialized Training", hint: "Confined space, QEW, H2, Crane Operator certification" },
  { key: "q2_chemicals", label: "Chemicals / Hazardous Materials", hint: "Task involves chemicals or hazardous substances" },
  { key: "q3_impactOthers", label: "Other Work in Area", hint: "Other work that may impact this task" },
  { key: "q4_falls", label: "Fall Hazard", hint: "Falls of 4 feet (1.2m) or greater" },
  { key: "q5_barricades", label: "Barricades Required", hint: "Trip hazards, floor tile removal" },
  { key: "q6_loto", label: "LOTO Required", hint: "Lock Out Tag Out procedures" },
  { key: "q7_lifting", label: "Heavy Lifting", hint: "Items over 35lbs / 15.9kg" },
  { key: "q8_ergonomics", label: "Ergonomic Concerns", hint: "Abnormal ergonomic situations" },
  { key: "q10_headInjury", label: "Head Injury Risk", hint: "Hard hat requirements" },
  { key: "q11_otherPPE", label: "Additional PPE", hint: "Knee pads, cut resistant gloves" },
  { key: "q9_otherConcerns", label: "Other Safety Concerns", hint: "Additional concerns not listed" },
];

interface Props {
  values: Record<string, "yes" | "no">;
  onChange: (key: string, value: "yes" | "no") => void;
}

export function SafetyCheckStep({ values, onChange }: Props) {
  const yesCount = QUESTIONS.filter(q => values[q.key] === "yes").length;
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Pretask Safety Check</h2>
            <p className="text-sm text-muted-foreground">
              {yesCount > 0 ? `${yesCount} concern${yesCount !== 1 ? "s" : ""} flagged` : "Tap each item to flag concerns"}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: tappable cards */}
      {isMobile && (
        <div className="space-y-2">
          {QUESTIONS.map((q, idx) => {
            const flagged = values[q.key] === "yes";
            return (
              <button
                key={q.key}
                type="button"
                onClick={() => onChange(q.key, flagged ? "no" : "yes")}
                className={cn(
                  "w-full text-left rounded-lg border-2 p-4 transition-all",
                  flagged
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                    flagged ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {flagged ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{q.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.hint}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop: table rows with yes/no buttons */}
      {!isMobile && (
        <TooltipProvider delayDuration={200}>
          <div className="rounded-lg border border-border overflow-hidden">
            {QUESTIONS.map((q, idx) => {
              const val = values[q.key];
              return (
                <div key={q.key} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                  <span className="text-[11px] font-semibold text-muted-foreground/50 w-5 shrink-0 text-right tabular-nums">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {q.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{q.hint}</p>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onChange(q.key, "yes")}
                      className={cn(
                        "h-7 w-12 rounded text-[11px] font-semibold transition-all",
                        val === "yes"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(q.key, "no")}
                      className={cn(
                        "h-7 w-12 rounded text-[11px] font-semibold transition-all",
                        val === "no"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
