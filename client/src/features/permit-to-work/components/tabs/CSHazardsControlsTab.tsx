import { Button } from "@/components/ui/button";
import { HazardControlChecklist, AtmosphericHazardChecklist } from "../HazardControlChecklist";
import type { TabProps } from "./tab-props";
import type { PhysicalHazardItem, AtmosphericHazardItem } from "../../types";

export function CSHazardsControlsTab({ watch, setValue, onNext, onPrev }: TabProps) {
  const physicalHazards = watch("physicalHazards") as PhysicalHazardItem[];
  const atmosphericHazards = watch("atmosphericHazards") as AtmosphericHazardItem[];

  const togglePhysicalHazard = (id: string) => {
    const updated = physicalHazards.map(h =>
      h.id === id ? { ...h, hazardPresent: !h.hazardPresent, controlApplied: !h.hazardPresent ? h.controlApplied : false } : h
    );
    setValue("physicalHazards", updated, { shouldDirty: true });
  };

  const togglePhysicalControl = (id: string) => {
    const updated = physicalHazards.map(h =>
      h.id === id ? { ...h, controlApplied: !h.controlApplied } : h
    );
    setValue("physicalHazards", updated, { shouldDirty: true });
  };

  const toggleAtmosphericHazard = (id: string) => {
    const updated = atmosphericHazards.map(h =>
      h.id === id ? { ...h, hazardPresent: !h.hazardPresent, monitorDeployed: !h.hazardPresent ? h.monitorDeployed : false } : h
    );
    setValue("atmosphericHazards", updated, { shouldDirty: true });
  };

  const toggleAtmosphericMonitor = (id: string) => {
    const updated = atmosphericHazards.map(h =>
      h.id === id ? { ...h, monitorDeployed: !h.monitorDeployed } : h
    );
    setValue("atmosphericHazards", updated, { shouldDirty: true });
  };

  const activePhysical = physicalHazards.filter(h => h.hazardPresent).length;
  const activeAtmospheric = atmosphericHazards.filter(h => h.hazardPresent).length;
  const total = activePhysical + activeAtmospheric;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-1 w-full">
          7. Hazards & Controls
        </p>
        <p className="text-xs text-muted-foreground">
          Identify hazards present and confirm controls applied.
          {total > 0 && <span className="ml-1 text-amber-600 font-medium">{total} hazard(s) identified</span>}
        </p>
      </div>

      <HazardControlChecklist
        title="7a. Physical Hazards"
        items={physicalHazards}
        onToggleHazard={togglePhysicalHazard}
        onToggleControl={togglePhysicalControl}
      />

      <AtmosphericHazardChecklist
        items={atmosphericHazards}
        onToggleHazard={toggleAtmosphericHazard}
        onToggleMonitor={toggleAtmosphericMonitor}
      />

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
