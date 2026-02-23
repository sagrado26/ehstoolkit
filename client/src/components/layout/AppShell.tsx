import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Menu, Search } from "lucide-react";
import { useTheme, isLightNav } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { navColor } = useTheme();
  const light = isLightNav(navColor);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header
          className={cn(
            "h-12 shrink-0 flex items-center justify-between px-3 sm:px-5",
            light && "border-b border-border bg-background"
          )}
          style={light ? undefined : { backgroundColor: "color-mix(in srgb, hsl(var(--nav-primary)) 30%, hsl(220 8% 14%))" }}
        >
          <div className="flex items-center gap-2">
            {/* Mobile: hamburger menu */}
            <button
              type="button"
              className={cn(
                "md:hidden h-8 w-8 flex items-center justify-center rounded-md transition-colors",
                light
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                  : "text-white/40 hover:text-white/70 hover:bg-white/8"
              )}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            {/* Search */}
            <div className="relative w-40 sm:w-56">
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
          <div className="flex items-center gap-3">
            <button type="button" className={cn(
              "relative h-8 w-8 flex items-center justify-center rounded-md transition-colors",
              light
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-white/40 hover:text-white/70 hover:bg-white/8"
            )}>
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
            </button>
            <div className={cn(
              "flex items-center gap-2 pl-3 border-l",
              light ? "border-border" : "border-white/10"
            )}>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold",
                light ? "bg-primary/10 text-primary" : "bg-white/15 text-white/80"
              )}>
                CK
              </div>
              <div className="hidden sm:block">
                <p className={cn(
                  "text-[13px] font-medium leading-none",
                  light ? "text-foreground" : "text-white/80"
                )}>Carl K.</p>
                <p className={cn(
                  "text-[10px] mt-0.5",
                  light ? "text-muted-foreground" : "text-white/40"
                )}>Admin</p>
              </div>
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
}
