import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDir = "asc" | "desc" | null;

interface SortableHeaderProps {
  label: string;
  field: string;
  current: { field: string; dir: SortDir };
  onSort: (field: string) => void;
  className?: string;
}

export function SortableHeader({ label, field, current, onSort, className }: SortableHeaderProps) {
  const active = current.field === field;
  return (
    <th
      className={cn(
        "text-left py-3 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors group",
        className,
      )}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && current.dir === "asc" && <ArrowUp className="h-3 w-3 text-primary" />}
        {active && current.dir === "desc" && <ArrowDown className="h-3 w-3 text-primary" />}
        {!active && <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />}
      </span>
    </th>
  );
}

/** Cycle through asc → desc → none */
export function nextSort(currentField: string, currentDir: SortDir, clickedField: string): { field: string; dir: SortDir } {
  if (currentField !== clickedField) return { field: clickedField, dir: "asc" };
  if (currentDir === "asc") return { field: clickedField, dir: "desc" };
  return { field: "", dir: null };
}

/** Generic compare for sorting — handles strings, numbers, dates */
export function sortRows<T>(rows: T[], field: string, dir: SortDir): T[] {
  if (!dir || !field) return rows;
  return [...rows].sort((a: any, b: any) => {
    let va = a[field];
    let vb = b[field];
    if (va == null) va = "";
    if (vb == null) vb = "";
    if (typeof va === "number" && typeof vb === "number") {
      return dir === "asc" ? va - vb : vb - va;
    }
    const sa = String(va).toLowerCase();
    const sb = String(vb).toLowerCase();
    return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
  });
}
