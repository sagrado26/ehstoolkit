import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";

export interface ColumnDef {
  key: string;
  label: string;
  defaultVisible?: boolean;
}

interface Props {
  columns: ColumnDef[];
  visible: Record<string, boolean>;
  onChange: (visible: Record<string, boolean>) => void;
}

export function ColumnToggle({ columns, visible, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Settings2 className="h-3.5 w-3.5" /> Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">Show / Hide Columns</p>
        {columns.map(col => (
          <div key={col.key} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/50">
            <span className="text-xs">{col.label}</span>
            <Switch
              checked={visible[col.key] !== false}
              onCheckedChange={(checked) => onChange({ ...visible, [col.key]: checked })}
              className="scale-75"
            />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function useColumnVisibility(columns: ColumnDef[]): [Record<string, boolean>, (v: Record<string, boolean>) => void] {
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach(c => { initial[c.key] = c.defaultVisible !== false; });
    return initial;
  });
  return [visible, setVisible];
}
