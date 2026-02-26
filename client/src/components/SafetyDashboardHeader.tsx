import { Bell, Menu, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";

interface SafetyDashboardHeaderProps {
  userName: string;
}

export default function SafetyDashboardHeader({ userName }: SafetyDashboardHeaderProps) {
  const { isMobile, toggleMobileOpen } = useSidebar();

  return (
    <header className="bg-background border-b border-border px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileOpen} data-testid="button-mobile-menu">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">EHS Ireland</span>
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold leading-snug">Safety Tracking Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-search-mobile">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
