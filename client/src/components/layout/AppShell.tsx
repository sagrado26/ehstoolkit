import { useState } from "react";
import { Sidebar } from "./Sidebar";
import DashboardHeader from "../DashboardHeader";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, closeMobile } = useSidebar();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [location] = useLocation();

  const PAGE_TITLES: Record<string, string> = {
    "/": "Dashboard",
    "/safety-plan": "Integrated Safety Plan (ISP)",
    "/permit-to-work": "Permit to Work (PtW)",
    "/safety-review-board": "Safety Review Board",
    "/crane-inspection": "Crane Inspection",
    "/draeger-calibration": "Draeger Calibration",
    "/incidents": "Incidents",
    "/documentation": "Documentation",
    "/admin": "Admin",
    "/settings": "Settings",
  };

  const pageTitle = PAGE_TITLES[location] || "Safety Tracking Dashboard";

  return (
    <div className="bg-background font-sans h-screen overflow-hidden flex text-foreground print:block print:h-auto print:overflow-visible">
      <div className="no-print">
        <Sidebar mobileOpen={isMobileOpen} onMobileClose={closeMobile} />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        <div className="no-print">
          <DashboardHeader
            userName={user?.displayName ?? "User"}
            dateRange={dateRange}
            setDateRange={setDateRange}
            pageTitle={pageTitle}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-transparent p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
