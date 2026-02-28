import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { TabProps } from "./tab-props";
import type { ToolChecklistItem } from "../../types";

export function CSToolsEquipmentTab({ watch, setValue, onNext, onPrev }: TabProps) {
  const tools = watch("toolsChecklist") as ToolChecklistItem[];

  const toggleTool = (id: string) => {
    const updated = tools.map(t => t.id === id ? { ...t, checked: !t.checked } : t);
    setValue("toolsChecklist", updated, { shouldDirty: true });
  };

  const checkedCount = tools.filter(t => t.checked).length;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-1 w-full">
          8. Tools & Equipment
        </p>
        <p className="text-xs text-muted-foreground">
          Select required tools and equipment.
          {checkedCount > 0 && <span className="ml-1 text-brand font-medium">{checkedCount} selected</span>}
        </p>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        {tools.map((tool, idx) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => toggleTool(tool.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
              idx < tools.length - 1 && "border-b border-border",
              tool.checked ? "bg-brand/[0.03]" : "hover:bg-muted/20"
            )}
          >
            <span className={cn(
              "h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0",
              tool.checked ? "bg-brand border-brand text-white" : "border-border bg-background"
            )}>
              {tool.checked && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-1">
        {onPrev && <Button type="button" variant="outline" size="sm" onClick={onPrev}>&larr; Back</Button>}
        <Button type="button" size="sm" className="ml-auto" onClick={onNext}>Next &rarr;</Button>
      </div>
    </div>
  );
}
