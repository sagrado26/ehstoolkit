import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COLORS = [
  "bg-blue-500/15 text-blue-700",
  "bg-emerald-500/15 text-emerald-700",
  "bg-violet-500/15 text-violet-700",
  "bg-amber-500/15 text-amber-700",
  "bg-rose-500/15 text-rose-700",
  "bg-cyan-500/15 text-cyan-700",
  "bg-orange-500/15 text-orange-700",
  "bg-indigo-500/15 text-indigo-700",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

interface Props {
  name: string;
  className?: string;
}

export function NameAvatar({ name, className }: Props) {
  if (!name) return <span className="text-muted-foreground">—</span>;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            "inline-flex items-center justify-center h-7 w-7 rounded-full text-[11px] font-bold shrink-0 cursor-default",
            getColor(name),
            className
          )}>
            {getInitials(name)}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
