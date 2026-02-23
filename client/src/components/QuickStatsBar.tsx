import { Users, AlertTriangle, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuickStat {
  label: string;
  value: string | number;
  subtext?: string;
  icon: typeof Users;
  color: string;
  progress?: number;
}

export default function QuickStatsBar() {
  const stats: QuickStat[] = [
    { 
      label: "Safety Score", 
      value: "98%", 
      subtext: "This month",
      icon: CheckCircle, 
      color: "text-emerald-500",
      progress: 98
    },
    { 
      label: "Open Hazards", 
      value: 3, 
      subtext: "Require action",
      icon: AlertTriangle, 
      color: "text-amber-500"
    },
    { 
      label: "Overdue Reviews", 
      value: 2, 
      subtext: "Past deadline",
      icon: Clock, 
      color: "text-red-500"
    },
    { 
      label: "Active Teams", 
      value: 12, 
      subtext: "On site today",
      icon: Users, 
      color: "text-blue-500"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx} 
            className="bg-card border border-card-border rounded-lg p-3 hover-elevate transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-1.5 rounded-md bg-muted ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              {stat.progress && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +2%
                </span>
              )}
            </div>
            <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            {stat.progress ? (
              <Progress value={stat.progress} className="h-1.5 mt-2" />
            ) : (
              <p className="text-[10px] text-muted-foreground/70 mt-1">{stat.subtext}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
