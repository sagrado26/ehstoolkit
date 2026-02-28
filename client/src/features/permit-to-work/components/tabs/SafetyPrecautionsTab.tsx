import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TabProps } from "./tab-props";

const SAFETY_QUESTIONS = [
  { key: "spq1" as const, text: "Where necessary, appropriate fire alarm zones / sprinkler systems have been isolated?" },
  { key: "spq2" as const, text: "Fire and emergency procedures have been communicated to all personnel on site?" },
  { key: "spq3" as const, text: "Appropriate fire fighting equipment is in place and accessible?" },
  { key: "spq4" as const, text: "Method for raising the alarm has been agreed and communicated?" },
  { key: "spq5" as const, text: "Where possible, combustible / flammable materials have been removed from the area of work?" },
];

export function SafetyPrecautionsTab({ control, onNext, onPrev }: TabProps) {
  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-xs text-muted-foreground">Confirm each safety precaution has been addressed.</p>
      <div className="border border-border rounded-md overflow-hidden">
        {SAFETY_QUESTIONS.map(({ key, text }, idx) => (
          <Controller key={key} name={key} control={control} render={({ field }) => (
            <div className={cn(
              "flex items-start gap-3 px-3 py-2.5 text-sm",
              idx < SAFETY_QUESTIONS.length - 1 && "border-b border-border",
              field.value === "yes" && "bg-brand/[0.03]"
            )}>
              <span className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 w-4 shrink-0">{idx + 1}.</span>
              <p className="flex-1 text-sm leading-snug">{text}</p>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => field.onChange("yes")}
                  className={cn(
                    "h-6 px-2 rounded text-[11px] font-medium border transition-colors",
                    field.value === "yes"
                      ? "bg-brand border-brand text-white"
                      : "border-border text-muted-foreground hover:border-brand/40"
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("no")}
                  className={cn(
                    "h-6 px-2 rounded text-[11px] font-medium border transition-colors",
                    field.value === "no"
                      ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                      : "border-border text-muted-foreground hover:border-red-300"
                  )}
                >
                  No
                </button>
              </div>
            </div>
          )} />
        ))}
      </div>
      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
