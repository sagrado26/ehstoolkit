import { useState } from "react";
import { Sidebar } from "./Sidebar";
import DashboardHeader from "../DashboardHeader";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/hooks/use-auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, closeMobile } = useSidebar();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="bg-muted font-sans h-screen overflow-hidden flex text-foreground">
      <Sidebar mobileOpen={isMobileOpen} onMobileClose={closeMobile} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={user?.displayName ?? "User"}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <div className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
