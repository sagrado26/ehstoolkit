import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardList, FileText, AlertTriangle, ShieldAlert,
  HardHat, TestTube2, FolderOpen, Settings, UserCog, Shield,
} from "lucide-react";
import { useEffect } from "react";
import { useTheme, isLightNav } from "@/hooks/use-theme";

const NAV = [
  {
    group: "GENERAL",
    items: [{ label: "Overview", href: "/", icon: LayoutDashboard }],
  },
  {
    group: "SAFETY",
    items: [
      { label: "Integrated Safety Plan", href: "/safety-plan", icon: ClipboardList },
      { label: "Permit to Work", href: "/permit-to-work", icon: FileText },
      { label: "Incidents", href: "/incidents", icon: AlertTriangle },
      { label: "Safety Review Board", href: "/safety-review-board", icon: ShieldAlert },
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

  // Deep blue gradient for sidebar
  const navBg: React.CSSProperties = {
    background: "linear-gradient(180deg, #0A1A6B 0%, #0F238C 50%, #0A1A6B 100%)",
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const navContent = (
    <>
      {/* Header */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <span className="font-bold text-sm text-white leading-none block">EHS Safety</span>
            <span className="text-[9px] text-white/40 font-medium uppercase tracking-wider">Ireland</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3 space-y-4 flex-1">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 px-4 mb-1.5">
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
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/10"
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
      <div className="p-3 border-t border-white/10">
        <Link href="/admin">
          <a className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-300 hover:bg-white/10">
            <UserCog className="w-4 h-4" />
            Admin
          </a>
        </Link>
        <Link href="/settings">
          <a className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors text-gray-300 hover:bg-white/10">
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
          <aside className="relative w-64 max-w-[80vw] flex flex-col justify-between h-full shadow-xl" style={navBg}>
            {navContent}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex flex-col justify-between h-screen w-64 shadow-xl shrink-0 z-20" style={navBg}>
        {navContent}
      </aside>
    </>
  );
}
