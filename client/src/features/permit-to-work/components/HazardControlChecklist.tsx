import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// ── Compact checkbox ────────────────────────────────────────────────────
function InlineCheck({ checked, onClick, disabled }: { checked: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0",
        disabled && "opacity-25 cursor-not-allowed",
        checked
          ? "bg-brand border-brand text-white"
          : "border-border hover:border-brand/50 bg-background"
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

// ── Physical Hazard Checklist ────────────────────────────────────────────

interface HazardControlPair {
  id: string;
  hazardLabel: string;
  controlLabel: string;
  hazardPresent: boolean;
  controlApplied: boolean;
}

interface HazardControlChecklistProps {
  title: string;
  items: HazardControlPair[];
  onToggleHazard: (id: string) => void;
  onToggleControl: (id: string) => void;
}

export function HazardControlChecklist({
  title,
  items,
  onToggleHazard,
  onToggleControl,
}: HazardControlChecklistProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
      <div className="border border-border rounded-md overflow-hidden text-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-x-3 px-3 py-2 bg-muted/40 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Hazard</span>
          <span className="w-5 text-center">Y/N</span>
          <span>Control Measure</span>
          <span className="w-5 text-center">Y/N</span>
        </div>
        {/* Rows */}
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[1fr_auto_1fr_auto] items-center gap-x-3 px-3 py-2 border-b border-border last:border-0 transition-colors",
              item.hazardPresent ? "bg-amber-50/40 dark:bg-amber-500/5" : "hover:bg-muted/20"
            )}
          >
            <span className="text-sm">{item.hazardLabel}</span>
            <InlineCheck checked={item.hazardPresent} onClick={() => onToggleHazard(item.id)} />
            <span className="text-sm text-muted-foreground">{item.controlLabel}</span>
            <InlineCheck
              checked={item.controlApplied}
              onClick={() => onToggleControl(item.id)}
              disabled={!item.hazardPresent}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Atmospheric Hazard Checklist ────────────────────────────────────────

interface AtmosphericPair {
  id: string;
  hazardLabel: string;
  monitorLabel: string;
  hazardPresent: boolean;
  monitorDeployed: boolean;
}

interface AtmosphericHazardChecklistProps {
  items: AtmosphericPair[];
  onToggleHazard: (id: string) => void;
  onToggleMonitor: (id: string) => void;
}

export function AtmosphericHazardChecklist({
  items,
  onToggleHazard,
  onToggleMonitor,
}: AtmosphericHazardChecklistProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Atmospheric Hazards</p>
      <div className="border border-border rounded-md overflow-hidden text-sm">
        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-x-3 px-3 py-2 bg-muted/40 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Hazard</span>
          <span className="w-5 text-center">Y/N</span>
          <span>Monitoring Control</span>
          <span className="w-5 text-center">Y/N</span>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[1fr_auto_1fr_auto] items-center gap-x-3 px-3 py-2 border-b border-border last:border-0 transition-colors",
              item.hazardPresent ? "bg-red-50/40 dark:bg-red-500/5" : "hover:bg-muted/20"
            )}
          >
            <span className="text-sm">{item.hazardLabel}</span>
            <InlineCheck checked={item.hazardPresent} onClick={() => onToggleHazard(item.id)} />
            <span className="text-sm text-muted-foreground">{item.monitorLabel}</span>
            <InlineCheck
              checked={item.monitorDeployed}
              onClick={() => onToggleMonitor(item.id)}
              disabled={!item.hazardPresent}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
