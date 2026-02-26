import { Bell, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";

interface DashboardHeaderProps {
    userName: string;
    dateRange: string;
    setDateRange: (value: string) => void;
    pageTitle?: string;
}

export default function DashboardHeader({ userName, dateRange: _dateRange, setDateRange: _setDateRange, pageTitle = "Safety Tracking Dashboard" }: DashboardHeaderProps) {
    const { toggleMobileOpen, toggleCollapsed, isMobile } = useSidebar();

    return (
        <header className="bg-transparent px-4 lg:px-6 py-4 shrink-0">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-500 hover:text-slate-800"
                        aria-label="Toggle sidebar"
                        onClick={() => (isMobile ? toggleMobileOpen() : toggleCollapsed())}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <Shield className="w-4 h-4" />
                            <span className="uppercase tracking-[0.12em] text-[11px]">EHS Ireland</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{pageTitle}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600" aria-label="Notifications">
                        <Bell className="w-4 h-4" />
                    </Button>

                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    <div className="flex items-center gap-2.5">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 leading-tight">{userName}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">EHS Manager</p>
                        </div>
                        <Avatar className="w-9 h-9 border border-slate-200">
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
