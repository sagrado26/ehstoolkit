import { Bell, Menu, Shield, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";

interface SafetyDashboardHeaderProps {
  userName: string;
}

export default function SafetyDashboardHeader({ userName }: SafetyDashboardHeaderProps) {
  const { isMobile, toggleMobileOpen } = useSidebar();

  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-3 sm:px-5 bg-brand-dark border-b border-white/10">
      {/* Left: mobile menu + branding + search */}
      <div className="flex items-center gap-2">
        {isMobile && (
          <button
            type="button"
            onClick={toggleMobileOpen}
            className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2 mr-2">
          <Shield className="w-4 h-4 text-brand-signal" />
          <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-wider">
            EHS Ireland
          </span>
        </div>

        {/* Search — desktop */}
        <div className="relative w-40 sm:w-56 hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            placeholder="Search..."
            readOnly
            className="w-full pl-8 pr-3 h-8 rounded-md text-[13px] font-sans border-0 outline-none bg-white/8 text-white/70 placeholder:text-white/30 focus:bg-white/12 transition-colors"
          />
        </div>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-3">
        {/* Search — mobile only */}
        <button
          type="button"
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="relative h-8 w-8 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-signal" />
        </button>

        <div className="h-6 w-px bg-white/10 mx-0.5" />

        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-white/15 text-white/80 text-[11px] font-bold">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-none text-white/80">{userName}</p>
            <p className="text-[10px] font-sans text-white/40 mt-0.5">EHS Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
