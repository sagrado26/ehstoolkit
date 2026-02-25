import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardList, FileText, AlertTriangle,
  HardHat, TestTube2, FolderOpen, Settings, UserCog, ShieldAlert,
} from "lucide-react";
import { useEffect } from "react";
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
      { label: "Safety Review Board", href: "/safety-review-board", icon: ShieldAlert },
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
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [location] = useLocation();
  const { navColor } = useTheme();
  const lightNav = isLightNav(navColor);

  const navBg: React.CSSProperties = { backgroundColor: "hsl(var(--nav-primary))" };
  const textBase = lightNav ? "text-gray-800" : "text-white";
  const textMuted = lightNav ? "text-gray-500" : "text-gray-400";
  const textSecondary = lightNav ? "text-gray-600" : "text-gray-300";
  const borderColor = lightNav ? "border-gray-200" : "border-white/10";
  const hoverBg = lightNav ? "hover:bg-black/5" : "hover:bg-white/10";
  const activeBg = lightNav ? "bg-black/5" : "bg-white/10";

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const navContent = (
    <>
      {/* Header */}
      <div className={`h-16 flex items-center px-5 border-b ${borderColor}`}>
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold", lightNav ? "bg-primary text-primary-foreground" : "bg-white/10 text-white")}>
            S
          </div>
          <span className={cn("font-bold text-base", textBase)}>EHS Safety</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3 space-y-4 flex-1">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className={cn("text-[10px] font-semibold uppercase tracking-widest px-4 mb-1.5", textMuted)}>
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors relative",
                        active
                          ? cn(textBase, activeBg)
                          : cn(textSecondary, hoverBg)
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
                      )}
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Sidebar */}
      <div className={`p-3 border-t ${borderColor}`}>
        <Link href="/admin">
          <a className={cn("flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors", textSecondary, hoverBg)}>
            <UserCog className="w-4 h-4" />
            Admin
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn("flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors", textSecondary, hoverBg)}>
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: slide-over sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className={cn("relative w-64 max-w-[80vw] flex flex-col justify-between h-full shadow-xl", lightNav ? "border-r border-gray-200" : "")} style={navBg}>
            {navContent}
          </aside>
        </div>
      )}

      <aside className={cn("hidden md:flex flex-col justify-between h-screen w-64 shadow-xl shrink-0 z-20", lightNav ? "border-r border-gray-200" : "")} style={navBg}>
        {navContent}
      </aside>
    </>
  );
}
