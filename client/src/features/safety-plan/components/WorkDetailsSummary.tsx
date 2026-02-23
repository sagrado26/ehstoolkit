import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  data: {
    taskName: string;
    group: string;
    location: string;
    date: string;
    shift: string;
    machineNumber: string;
  };
  onEdit: () => void;
}

export function WorkDetailsSummary({ data, onEdit }: Props) {
  return (
    <div className="flex items-center justify-between bg-muted/50 rounded-lg px-5 py-3.5 mb-5">
      <div className="flex items-center gap-3 flex-wrap text-[13px]">
        <span className="font-semibold text-foreground">{data.taskName}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">{data.group}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">{data.location}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">{data.date}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">{data.shift}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span className="text-muted-foreground">Machine: {data.machineNumber}</span>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="shrink-0 ml-4 gap-1.5">
        <Pencil className="h-3 w-3" /> Edit
      </Button>
    </div>
  );
}
