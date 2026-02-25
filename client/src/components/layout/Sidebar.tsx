import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardList, FileText, AlertTriangle,
  HardHat, TestTube2, FolderOpen, Settings, UserCog, ShieldAlert,
} from "lucide-react";
import { useEffect } from "react";

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
          <div className="w-8 h-8 rounded-md bg-brand-signal flex items-center justify-center text-sm font-bold text-white">
            S
          </div>
          <span className="font-bold text-base text-white">EHS Safety</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3 space-y-4 flex-1">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="text-[10px] font-semibold uppercase tracking-widest px-4 mb-1.5 text-white/30">
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
                        "flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium rounded-md transition-colors relative",
                        active
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:bg-white/8 hover:text-white/80"
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-signal rounded-r-md" />
                      )}
                      <div className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                        active ? "bg-brand-signal/20 text-brand-signal" : "bg-white/8 text-white/50"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
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
          <a className="flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium rounded-md transition-colors text-white/60 hover:bg-white/8 hover:text-white/80">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-white/8 text-white/50 shrink-0">
              <UserCog className="w-4 h-4" />
            </div>
            Admin
          </a>
        </Link>
        <Link href="/settings">
          <a className="flex items-center gap-3 px-4 py-3 text-sm font-sans font-medium rounded-md transition-colors text-white/60 hover:bg-white/8 hover:text-white/80">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-white/8 text-white/50 shrink-0">
              <Settings className="w-4 h-4" />
            </div>
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
          <aside className="relative w-64 max-w-[80vw] flex flex-col justify-between h-full shadow-xl bg-gradient-to-b from-brand-dark via-brand to-brand-dark">
            {navContent}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex flex-col justify-between h-screen w-64 shadow-xl shrink-0 z-20 bg-gradient-to-b from-brand-dark via-brand to-brand-dark">
        {navContent}
      </aside>
    </>
  );
}
