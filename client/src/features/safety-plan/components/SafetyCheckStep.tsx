import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { SAFETY_QUESTIONS } from "../risk-utils";

interface Props {
  values: Record<string, "yes" | "no">;
  onChange: (key: string, value: "yes" | "no") => void;
}

export function SafetyCheckStep({ values, onChange }: Props) {
  const yesCount = SAFETY_QUESTIONS.filter(q => values[q.key] === "yes").length;
  const isMobile = useIsMobile();

  return (
    <div className="space-y-3">
      {yesCount > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 inline-block">
          {yesCount} flagged
        </span>
      )}

      {/* Mobile: tappable cards */}
      {isMobile && (
        <div className="space-y-2">
          {SAFETY_QUESTIONS.map((q, idx) => {
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

      {/* Desktop: clickable rows with yes/no buttons */}
      {!isMobile && (
        <TooltipProvider delayDuration={200}>
          <div className="rounded-lg border border-border overflow-hidden">
            {SAFETY_QUESTIONS.map((q, idx) => {
              const val = values[q.key];
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => onChange(q.key, val === "yes" ? "no" : "yes")}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                >
                  <span className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                    val === "yes" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {val === "yes" ? <Check className="h-3 w-3" /> : idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {q.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{q.hint}</p>
                  </div>

                  <div className="flex gap-1 shrink-0 pointer-events-none">
                    <span className={cn(
                      "h-7 w-12 rounded text-[11px] font-semibold transition-all flex items-center justify-center",
                      val === "yes"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted text-muted-foreground"
                    )}>
                      Yes
                    </span>
                    <span className={cn(
                      "h-7 w-12 rounded text-[11px] font-semibold transition-all flex items-center justify-center",
                      val === "no"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    )}>
                      No
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
