import { Bell, Menu, Shield, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTheme, isLightNav } from "@/hooks/use-theme";

interface SafetyDashboardHeaderProps {
  userName: string;
}

export default function SafetyDashboardHeader({ userName }: SafetyDashboardHeaderProps) {
  const { isMobile, toggleMobileOpen } = useSidebar();
  const { navColor } = useTheme();
  const light = isLightNav(navColor);

  return (
    <header
      className={cn(
        "h-12 shrink-0 flex items-center justify-between px-3 sm:px-5",
        light && "border-b border-border bg-background"
      )}
      style={light ? undefined : { backgroundColor: "color-mix(in srgb, hsl(var(--nav-primary)) 30%, hsl(220 8% 14%))" }}
    >
      {/* Left: mobile menu + branding + search */}
      <div className="flex items-center gap-2">
        {isMobile && (
          <button
            type="button"
            onClick={toggleMobileOpen}
            className={cn(
              "md:hidden h-8 w-8 flex items-center justify-center rounded-md transition-colors",
              light
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-white/40 hover:text-white/70 hover:bg-white/8"
            )}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2 mr-2">
          <Shield className={cn("w-4 h-4", light ? "text-primary" : "text-white/60")} />
          <span className={cn(
            "text-[10px] sm:text-xs font-semibold uppercase tracking-wider",
            light ? "text-primary" : "text-white/60"
          )}>
            EHS Ireland
          </span>
        </div>

        {/* Search — desktop */}
        <div className="relative w-40 sm:w-56 hidden md:block">
          <Search className={cn(
            "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5",
            light ? "text-muted-foreground" : "text-white/30"
          )} />
          <input
            placeholder="Search..."
            readOnly
            className={cn(
              "w-full pl-8 pr-3 h-8 rounded-md text-[13px] border-0 outline-none transition-colors",
              light
                ? "bg-muted text-foreground placeholder:text-muted-foreground focus:bg-muted/80"
                : "bg-white/8 text-white/70 placeholder:text-white/30 focus:bg-white/12"
            )}
          />
        </div>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-3">
        {/* Search — mobile only */}
        <button
          type="button"
          className={cn(
            "md:hidden h-8 w-8 flex items-center justify-center rounded-md transition-colors",
            light
              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
              : "text-white/40 hover:text-white/70 hover:bg-white/8"
          )}
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "relative h-8 w-8 flex items-center justify-center rounded-md transition-colors",
            light
              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
              : "text-white/40 hover:text-white/70 hover:bg-white/8"
          )}
          data-testid="button-notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
        </button>

        <div className={cn(
          "flex items-center gap-2 pl-3 border-l",
          light ? "border-border" : "border-white/10"
        )}>
          <Avatar className="w-7 h-7">
            <AvatarFallback className={cn(
              "text-[11px] font-semibold",
              light ? "bg-primary/10 text-primary" : "bg-white/15 text-white/80"
            )}>
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className={cn(
              "text-[13px] font-medium leading-none",
              light ? "text-foreground" : "text-white/80"
            )}>{userName}</p>
            <p className={cn(
              "text-[10px] mt-0.5",
              light ? "text-muted-foreground" : "text-white/40"
            )}>EHS Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
