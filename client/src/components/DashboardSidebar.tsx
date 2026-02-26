import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  BarChart3,
  Globe,
  BookOpen,
  HelpCircle,
  Settings,
  User,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ChevronDown,
  Eye,
  Shield,
  HardHat,
  Gauge,
  FileWarning
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

interface NavTreeItem {
  icon: typeof LayoutDashboard;
  label: string;
  children: NavItem[];
}

const overviewItem: NavItem = { icon: LayoutDashboard, label: "Dashboard", href: "/" };

const ispTree: NavTreeItem = {
  icon: ClipboardCheck,
  label: "Safety Plans",
  children: [
    { icon: Eye, label: "View All", href: "/safety-plan" },
  ],
};

const ptwTree: NavTreeItem = {
  icon: FileText,
  label: "Permit to Work",
  children: [
    { icon: Eye, label: "View All", href: "/permit-to-work" },
  ],
};

const otherGeneralItems: NavItem[] = [
  { icon: HardHat, label: "Crane Inspections", href: "/crane-inspection" },
  { icon: Gauge, label: "Draeger Calibration", href: "/draeger-calibration" },
  { icon: FileWarning, label: "Incidents", href: "/incidents" },
  { icon: BarChart3, label: "Documentation", href: "/documentation" },
];

const toolItems: NavItem[] = [
  { icon: Globe, label: "EHS Sharepoint", href: "/ehs-sharepoint" },
  { icon: BookOpen, label: "EHS WoW", href: "/ehs-wow" },
  { icon: AlertTriangle, label: "Admin", href: "/admin" },
];

const bottomItems: NavItem[] = [
  { icon: HelpCircle, label: "Help Center", href: "/help" },
  { icon: Settings, label: "Setting", href: "/settings" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function DashboardSidebar() {
  const [location] = useLocation();
  const { isCollapsed, isMobileOpen, isMobile, toggleCollapsed, closeMobile } = useSidebar();
  const [ispOpen, setIspOpen] = useState(true);
  const [ptwOpen, setPtwOpen] = useState(false);

  const NavLink = ({ item, indent = false }: { item: NavItem; indent?: boolean }) => {
    const isActive = location === item.href;

    const linkContent = (
      <Link href={item.href} onClick={closeMobile}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${isActive
            ? "bg-white/10 border-l-4 border-brand-light text-white font-medium"
            : "border-l-4 border-transparent text-gray-300 hover:bg-white/10"
            } ${isCollapsed && !isMobile ? "justify-center px-2" : ""} ${indent && !isCollapsed ? "pl-10" : ""}`}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <item.icon className={`flex-shrink-0 ${indent ? "w-4 h-4" : "w-5 h-5"}`} />
          {(!isCollapsed || isMobile) && <span className="text-sm truncate">{item.label}</span>}
        </div>
      </Link>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  const sidebarWidth = isCollapsed && !isMobile ? "w-16" : "w-64";

  const sidebarContent = (
    <>
      <div className={`p-4 border-b border-brand-light/30 flex items-center ${isCollapsed && !isMobile ? "justify-center" : "justify-between"}`}>
        {(!isCollapsed || isMobile) ? (
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 40" className="h-8 w-auto">
              <rect x="0" y="0" width="100" height="40" fill="#0F238C" rx="4" />
              <text x="50" y="27" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">ASML</text>
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
        )}

        {isMobile ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="lg:hidden text-muted-foreground hover:text-foreground" data-testid="button-toggle-sidebar">
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={closeMobile} data-testid="button-close-sidebar">
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-collapse-header"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="mb-6">
          {(!isCollapsed || isMobile) && (
            <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">General</p>
          )}
          <NavLink item={overviewItem} />

          {/* ISP Collapsible Tree */}
          {isCollapsed && !isMobile ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href="/">
                  <div className="flex items-center justify-center px-2 py-2.5 text-muted-foreground hover-elevate cursor-pointer border-l-4 border-transparent" data-testid="nav-isp-collapsed">
                    <ispTree.icon className="w-5 h-5" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {ispTree.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Collapsible open={ispOpen} onOpenChange={setIspOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between px-4 py-2.5 text-gray-300 hover:bg-white/10 cursor-pointer border-l-4 border-transparent" data-testid="nav-isp-trigger">
                  <div className="flex items-center gap-3">
                    <ispTree.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm truncate">{ispTree.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${ispOpen ? "rotate-180" : ""}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {ispTree.children.map((child) => (
                  <NavLink key={child.href + child.label} item={child} indent />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* PtW Collapsible Tree */}
          {isCollapsed && !isMobile ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href="/permit-to-work">
                  <div className="flex items-center justify-center px-2 py-2.5 text-muted-foreground hover-elevate cursor-pointer border-l-4 border-transparent" data-testid="nav-ptw-collapsed">
                    <ptwTree.icon className="w-5 h-5" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {ptwTree.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Collapsible open={ptwOpen} onOpenChange={setPtwOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between px-4 py-2.5 text-gray-300 hover:bg-white/10 cursor-pointer border-l-4 border-transparent" data-testid="nav-ptw-trigger">
                  <div className="flex items-center gap-3">
                    <ptwTree.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm truncate">{ptwTree.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${ptwOpen ? "rotate-180" : ""}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {ptwTree.children.map((child) => (
                  <NavLink key={child.href + child.label} item={child} indent />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {otherGeneralItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div>
          {(!isCollapsed || isMobile) && (
            <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tools</p>
          )}

          {toolItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-brand-light/30 py-4">
        {/* Date Display */}
        <div className={`px-4 py-3 mb-2 ${isCollapsed && !isMobile ? "px-2 text-center" : ""}`}>
          {(!isCollapsed || isMobile) ? (
            <div className="flex items-center gap-3 text-gray-300">
              <CalendarDays className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-white">{new Date().toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <p className="text-xs">{new Date().getFullYear()}</p>
              </div>
            </div>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex justify-center text-gray-300">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {new Date().toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {!isMobile && (
          <div className={`px-4 pt-4 ${isCollapsed ? "flex justify-center px-2" : ""}`}>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={toggleCollapsed}
              className="w-full"
              data-testid="button-toggle-sidebar"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobile}
          />
        )}
        <aside
          className={`fixed left-0 top-0 h-screen bg-brand-dark border-r border-brand-light/30 flex flex-col z-50 transition-transform duration-300 ease-in-out w-64 text-white ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside className={`h-screen bg-brand-dark border-r border-brand-light/30 flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out text-white ${sidebarWidth}`}>
      {sidebarContent}
    </aside>
  );
}
