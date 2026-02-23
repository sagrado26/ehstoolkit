import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardList, FileText, AlertTriangle,
  HardHat, TestTube2, FolderOpen, Settings, ChevronLeft, ChevronRight,
  ShieldCheck, X, UserCog,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme, isLightNav } from "@/hooks/use-theme";

const NAV = [
  {
    group: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    group: "SAFETY",
    items: [
      { label: "Safety Plan", href: "/safety-plan", icon: ClipboardList },
      { label: "Permit to Work", href: "/permit-to-work", icon: FileText },
      { label: "Incidents", href: "/incidents", icon: AlertTriangle },
    ],
  },
  {
    group: "EQUIPMENT",
    items: [
      { label: "Crane Inspection", href: "/crane-inspection", icon: HardHat },
      { label: "Draeger Calibration", href: "/draeger-calibration", icon: TestTube2 },
    ],
  },
  {
    group: "RESOURCES",
    items: [{ label: "Documentation", href: "/documentation", icon: FolderOpen }],
  },
  {
    group: "ADMIN",
    items: [
      { label: "Admin", href: "/admin", icon: UserCog },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { navColor } = useTheme();
  const light = isLightNav(navColor);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const bgStyle = light
    ? undefined
    : { backgroundColor: "color-mix(in srgb, hsl(var(--nav-primary)) 35%, hsl(220 8% 10%))" };

  const navContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
            light ? "bg-primary/10" : "bg-white/12"
          )}>
            <ShieldCheck className={cn("h-3.5 w-3.5", light ? "text-primary" : "text-white/80")} />
          </div>
          {!collapsed && (
            <span className={cn(
              "font-semibold text-sm tracking-tight",
              light ? "text-foreground" : "text-white/90"
            )}>
              EHS Safety
            </span>
          )}
        </div>
        {/* Desktop: collapse toggle */}
        <button
          type="button"
          className={cn(
            "hidden md:flex ml-auto h-7 w-7 items-center justify-center rounded-md transition-colors",
            light
              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
              : "text-white/40 hover:text-white/70 hover:bg-white/8"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
        {/* Mobile: close button */}
        {onMobileClose && (
          <button
            type="button"
            className={cn(
              "md:hidden ml-auto h-7 w-7 flex items-center justify-center rounded-md transition-colors",
              light
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-white/40 hover:text-white/70 hover:bg-white/8"
            )}
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.group}>
            {!collapsed && (
              <p className={cn(
                "px-4 mb-2 text-[10px] font-medium uppercase tracking-widest",
                light ? "text-muted-foreground/60" : "text-white/30"
              )}>
                {section.group}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-[13px] mx-2 rounded-md transition-colors duration-100",
                        light
                          ? active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          : active
                            ? "bg-white/12 text-white font-medium"
                            : "text-white/50 hover:text-white/75 hover:bg-white/6"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: slide-over sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside
            className={cn(
              "relative w-64 max-w-[80vw] flex flex-col h-full shadow-xl animate-in slide-in-from-left duration-200",
              light
                ? navColor === "transparent"
                  ? "bg-background border-r border-border"
                  : "bg-white border-r border-border dark:bg-card dark:border-border"
                : ""
            )}
            style={bgStyle}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop: permanent sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          light
            ? navColor === "transparent"
              ? "bg-transparent border-r border-border"
              : "bg-white border-r border-border dark:bg-card dark:border-border"
            : ""
        )}
        style={bgStyle}
      >
        {navContent}
      </aside>
    </>
  );
}
