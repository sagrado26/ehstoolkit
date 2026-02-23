import { Bell, AlertTriangle, Info, CheckCircle, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Bulletin {
  id: string;
  type: "alert" | "info" | "success";
  title: string;
  date: string;
}

const bulletins: Bulletin[] = [
  { id: "1", type: "alert", title: "Updated PPE requirements for Zone A", date: "Dec 24" },
  { id: "2", type: "info", title: "Safety training scheduled for Jan 15", date: "Dec 23" },
  { id: "3", type: "success", title: "Zero incidents reported this week", date: "Dec 22" },
  { id: "4", type: "alert", title: "Fire drill scheduled for Building 3", date: "Dec 21" },
  { id: "5", type: "info", title: "New chemical handling procedures", date: "Dec 20" },
];

interface BulletinsCardProps {
  hideHeader?: boolean;
  className?: string;
}

export default function BulletinsCard({ hideHeader = false, className = "" }: BulletinsCardProps) {
  const iconConfig = {
    alert: { 
      Icon: AlertTriangle, 
      iconColor: "text-white", 
      bg: "bg-gradient-to-br from-amber-400 to-orange-500", 
      badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0" 
    },
    info: { 
      Icon: Info, 
      iconColor: "text-white", 
      bg: "bg-gradient-to-br from-blue-400 to-blue-600", 
      badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-0" 
    },
    success: { 
      Icon: CheckCircle, 
      iconColor: "text-white", 
      bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", 
      badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0" 
    },
  };

  return (
    <div className={`bg-card border border-card-border rounded-xl overflow-hidden ${className}`}>
      {!hideHeader && (
        <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Bulletins & Updates</h3>
              <p className="text-xs text-white/70">Latest safety news</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-xs text-white/90 font-medium hover:text-white transition-colors" data-testid="button-view-all-bulletins">
            View all
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="p-2 space-y-1">
        {bulletins.map((bulletin, index) => {
          const { Icon, iconColor, bg, badgeClass } = iconConfig[bulletin.type];
          return (
            <div 
              key={bulletin.id} 
              className="flex items-center gap-3 p-2.5 rounded-lg hover-elevate cursor-pointer transition-all group"
              data-testid={`bulletin-${bulletin.id}`}
            >
              <div className={`p-1.5 rounded-lg ${bg} shadow-sm flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{bulletin.title}</p>
                <p className="text-xs text-muted-foreground">{bulletin.date}</p>
              </div>
              <Badge className={`text-[10px] px-2 py-0.5 flex-shrink-0 font-semibold ${badgeClass}`}>
                {bulletin.type === "alert" ? "Alert" : bulletin.type === "info" ? "Info" : "Update"}
              </Badge>
            </div>
          );
        })}
      </div>
      
      <div className="px-4 py-2 border-t border-card-border bg-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>{bulletins.length} new updates this week</span>
        </div>
      </div>
    </div>
  );
}
