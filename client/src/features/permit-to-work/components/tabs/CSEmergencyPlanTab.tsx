import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { TabProps } from "./tab-props";
import type { ExtractionSituation, ExtractionMethod, ExtractionEquipment, MedicalEquipmentItem } from "../../types";

function InlineCheck({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0",
      checked ? "bg-brand border-brand text-white" : "border-border hover:border-brand/50 bg-background"
    )}>
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

function SimpleChecklist<T extends { id: string; label: string }>({
  title,
  items,
  checkedKey,
  onToggle,
}: {
  title: string;
  items: T[];
  checkedKey: keyof T;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
      <div className="border border-border rounded-md overflow-hidden">
        {items.map((item, idx) => {
          const checked = item[checkedKey] as boolean;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
                idx < items.length - 1 && "border-b border-border",
                checked ? "bg-brand/[0.03]" : "hover:bg-muted/20"
              )}
            >
              <InlineCheck checked={checked} onClick={() => {}} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CSEmergencyPlanTab({ register, watch, setValue, onNext, onPrev }: TabProps) {
  const situations = watch("extractionSituations") as ExtractionSituation[];
  const methods = watch("extractionMethods") as ExtractionMethod[];
  const equipment = watch("extractionEquipment") as ExtractionEquipment[];
  const medical = watch("medicalEquipment") as MedicalEquipmentItem[];

  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 w-full">
        9. Emergency Extraction Plan
      </p>

      {/* ERT Contact */}
      <div className="space-y-0.5">
        <Label className="text-xs">ERT Phone / Radio Contact</Label>
        <Input {...register("ertContactInfo")} placeholder="Phone number or radio channel" className="h-8 text-sm max-w-sm" />
      </div>

      <SimpleChecklist
        title="Potential Extraction Situations"
        items={situations}
        checkedKey="applicable"
        onToggle={(id) => {
          const updated = situations.map(s => s.id === id ? { ...s, applicable: !s.applicable } : s);
          setValue("extractionSituations", updated, { shouldDirty: true });
        }}
      />

      <SimpleChecklist
        title="Method of Extraction"
        items={methods}
        checkedKey="selected"
        onToggle={(id) => {
          const updated = methods.map(m => m.id === id ? { ...m, selected: !m.selected } : m);
          setValue("extractionMethods", updated, { shouldDirty: true });
        }}
      />

      <SimpleChecklist
        title="Extraction Equipment"
        items={equipment}
        checkedKey="available"
        onToggle={(id) => {
          const updated = equipment.map(e => e.id === id ? { ...e, available: !e.available } : e);
          setValue("extractionEquipment", updated, { shouldDirty: true });
        }}
      />

      <SimpleChecklist
        title="Medical Equipment in Cleanroom"
        items={medical}
        checkedKey="available"
        onToggle={(id) => {
          const updated = medical.map(m => m.id === id ? { ...m, available: !m.available } : m);
          setValue("medicalEquipment", updated, { shouldDirty: true });
        }}
      />

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
