import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

function getRiskLabel(score: number) {
  if (score >= 16) return { label: "Extreme", bg: "bg-red-100 text-red-700" };
  if (score >= 10) return { label: "Very High", bg: "bg-orange-100 text-orange-700" };
  if (score >= 5)  return { label: "High", bg: "bg-amber-100 text-amber-700" };
  return { label: "Low", bg: "bg-emerald-100 text-emerald-700" };
}

interface Props {
  hazardName: string;
  severity: number;
  likelihood: number;
  mitigation: string;
  onSeverityChange: (v: number) => void;
  onLikelihoodChange: (v: number) => void;
  onMitigationChange: (v: string) => void;
  onRemove: () => void;
}

export function HazardCard({ hazardName, severity, likelihood, mitigation, onSeverityChange, onLikelihoodChange, onMitigationChange, onRemove }: Props) {
  const score = severity * likelihood;
  const risk = getRiskLabel(score);

  return (
    <Card className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold text-foreground">{hazardName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded", risk.bg)}>
              {risk.label}
            </span>
            <span className="text-[11px] text-muted-foreground">Score: {score}</span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Severity x Likelihood */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label className="text-xs">Severity (1–4)</Label>
          <div className="flex gap-1.5 mt-1.5">
            {[1,2,3,4].map(v => (
              <button key={v} type="button" onClick={() => onSeverityChange(v)}
                className={cn(
                  "h-9 w-9 rounded-md text-xs font-semibold transition-all",
                  severity === v
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                )}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs">Likelihood (1–4)</Label>
          <div className="flex gap-1.5 mt-1.5">
            {[1,2,3,4].map(v => (
              <button key={v} type="button" onClick={() => onLikelihoodChange(v)}
                className={cn(
                  "h-9 w-9 rounded-md text-xs font-semibold transition-all",
                  likelihood === v
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                )}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mitigation */}
      <div>
        <Label className="text-xs">Mitigation Plan</Label>
        <Textarea
          rows={2}
          value={mitigation}
          onChange={e => onMitigationChange(e.target.value)}
          placeholder="Describe controls and mitigations..."
          className="mt-1.5 text-sm"
        />
      </div>
    </Card>
  );
}
