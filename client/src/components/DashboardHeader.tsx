import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  userName: string;
  dateRange: string;
  setDateRange: (value: string) => void;
}

export default function DashboardHeader({ userName, dateRange, setDateRange }: DashboardHeaderProps) {
  return (
    <header className="bg-transparent border-b border-slate-200 px-4 lg:px-6 py-3 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1"></div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 relative">
            <Bell className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-500 leading-tight">EHS Manager</p>
            </div>
            <Avatar className="w-8 h-8 border border-slate-200">
              <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
