import { TrendingUp, TrendingDown, FileText, Clock, CheckCircle } from "lucide-react";

interface OverlayMetricCardProps {
  icon: "recorded" | "approved" | "pending";
  label: string;
  value: number;
  changePercent: number;
  comparisonText: string;
}

export default function OverlayMetricCard({ icon, label, value, changePercent, comparisonText }: OverlayMetricCardProps) {
  const isPositive = changePercent >= 0;
  
  const iconConfig = {
    recorded: { 
      bg: "bg-blue-500", 
      borderColor: "border-l-blue-400",
      Icon: FileText 
    },
    approved: { 
      bg: "bg-emerald-500", 
      borderColor: "border-l-emerald-400",
      Icon: CheckCircle 
    },
    pending: { 
      bg: "bg-amber-500", 
      borderColor: "border-l-amber-400",
      Icon: Clock 
    },
  };

  const { bg, borderColor, Icon } = iconConfig[icon];

  return (
    <div className={`bg-card/95 backdrop-blur-md border-l-4 ${borderColor} rounded-lg shadow-lg p-3 min-w-[160px]`}>
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${bg} shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl font-bold tracking-tight" data-testid={`text-overlay-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(changePercent).toFixed(1)}%
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground/70">{comparisonText}</p>
        </div>
      </div>
    </div>
  );
}
