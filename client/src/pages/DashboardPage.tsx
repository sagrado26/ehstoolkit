import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, FileText, HardHat, TestTube2, AlertTriangle,
  TrendingUp, ShieldCheck, ArrowUpRight, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

export default function DashboardPage() {
  const { data: plans = [] } = useQuery({ queryKey: ["/api/safety-plans"] });
  const { data: permits = [] } = useQuery({ queryKey: ["/api/permits"] });
  const { data: craneInspections = [] } = useQuery({ queryKey: ["/api/crane-inspections"] });
  const { data: calibrations = [] } = useQuery({ queryKey: ["/api/draeger-calibrations"] });
  const { data: incidents = [] } = useQuery({ queryKey: ["/api/incidents"] });

  const activePlans = (plans as any[]).filter(p => p.status === "pending").length;
  const openPermits = (permits as any[]).filter(p => p.status !== "approved").length;
  const openIncidents = (incidents as any[]).filter((i: any) => i.status === "open").length;
  const investigatingIncidents = (incidents as any[]).filter((i: any) => i.status === "investigating").length;

  const totalIncidents = (incidents as any[]).length;
  const highSeverity = (incidents as any[]).filter((i: any) => i.severity >= 3).length;
  const safetyIndex = Math.max(0, Math.min(100, 100 - (totalIncidents * 5) - (highSeverity * 10) - (openPermits * 3)));

  const correctiveActions = { completed: 12, overdue: 3, inProgress: 7, total: 22 };

  const cultureTrend = [
    { month: "Sep", score: 72, reports: 8 },
    { month: "Oct", score: 68, reports: 12 },
    { month: "Nov", score: 74, reports: 6 },
    { month: "Dec", score: 79, reports: 9 },
    { month: "Jan", score: 83, reports: 5 },
    { month: "Feb", score: 87, reports: 4 },
  ];

  const incidentBreakdown = [
    { name: "Near Miss", value: 3, color: "#6b8cc7" },
    { name: "Injury", value: 1, color: "#d97770" },
    { name: "Property", value: 1, color: "#d4a95a" },
    { name: "Environmental", value: 1, color: "#6bb58e" },
  ];

  const correctiveBar = [
    { category: "Plans", open: 4, closed: 8 },
    { category: "Permits", open: 2, closed: 5 },
    { category: "Incidents", open: 3, closed: 6 },
    { category: "Equipment", open: 1, closed: 3 },
  ];

  const recentPlans = (plans as any[]).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px]">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Safety Dashboard</h1>
        <p className="text-muted-foreground text-[13px] mt-0.5">EHS Ireland — Overview</p>
      </div>

      {/* Row 1: Safety Index + KPI cards */}
      <div className="grid grid-cols-12 gap-4">
        {/* Safety Index — calm hero using sidebar blue family */}
        <Card className="col-span-12 lg:col-span-4 relative overflow-hidden bg-[hsl(225,50%,28%)] text-white border-0">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1">Safety Index</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-bold tabular-nums text-white">{safetyIndex}</span>
                  <span className="text-sm text-white/40">/100</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="h-3 w-3 text-emerald-300/80" />
                  <span className="text-[11px] text-emerald-300/80">+4.2% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white/60" />
              </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-white/12 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${safetyIndex}%`,
                  backgroundColor: safetyIndex >= 80 ? '#6ee7b7' : safetyIndex >= 60 ? '#fcd34d' : '#fca5a5',
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-white/30">
              <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI cards — quiet, let data speak */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Plans", value: activePlans, icon: ClipboardList, color: "text-blue-500/70", bg: "bg-blue-50/70" },
            { label: "Open Permits", value: openPermits, icon: FileText, color: "text-amber-500/70", bg: "bg-amber-50/70" },
            { label: "Open Incidents", value: openIncidents + investigatingIncidents, icon: AlertTriangle, color: "text-red-500/70", bg: "bg-red-50/70" },
            { label: "Equipment Checks", value: (craneInspections as any[]).length + (calibrations as any[]).length, icon: HardHat, color: "text-emerald-500/70", bg: "bg-emerald-50/70" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label}>
                <CardContent className="pt-5 pb-4">
                  <div className={`h-9 w-9 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-4 w-4 ${m.color}`} />
                  </div>
                  <p className="text-2xl font-semibold">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Row 2: Corrective Actions + Health Culture Trend */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-medium">Corrective Actions</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-emerald-50/60 px-3 py-2.5 text-center">
                <p className="text-lg font-semibold text-emerald-700/80">{correctiveActions.completed}</p>
                <p className="text-[10px] text-emerald-600/70 font-medium">Completed</p>
              </div>
              <div className="rounded-lg bg-amber-50/60 px-3 py-2.5 text-center">
                <p className="text-lg font-semibold text-amber-700/80">{correctiveActions.inProgress}</p>
                <p className="text-[10px] text-amber-600/70 font-medium">In Progress</p>
              </div>
              <div className="rounded-lg bg-red-50/60 px-3 py-2.5 text-center">
                <p className="text-lg font-semibold text-red-700/80">{correctiveActions.overdue}</p>
                <p className="text-[10px] text-red-600/70 font-medium">Overdue</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={correctiveBar} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 10% 92%)" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "hsl(220 8% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220 8% 55%)" }} axisLine={false} tickLine={false} width={20} />
                <Tooltip />
                <Bar dataKey="closed" fill="hsl(225 50% 40%)" radius={[3, 3, 0, 0]} barSize={14} name="Closed" />
                <Bar dataKey="open" fill="hsl(225 30% 75%)" radius={[3, 3, 0, 0]} barSize={14} name="Open" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-medium">Health & Safety Culture Trend</CardTitle>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(225,50%,40%)] inline-block" /> Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60 inline-block" /> Reports
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cultureTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 10% 92%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220 8% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="score" tick={{ fontSize: 10, fill: "hsl(220 8% 55%)" }} axisLine={false} tickLine={false} width={28} domain={[50, 100]} />
                <YAxis yAxisId="reports" orientation="right" tick={{ fontSize: 10, fill: "hsl(220 8% 55%)" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip />
                <Area yAxisId="score" type="monotone" dataKey="score" stroke="hsl(225 50% 40%)" fill="hsl(225 50% 40% / 0.08)" strokeWidth={1.5} name="Culture Score" />
                <Area yAxisId="reports" type="monotone" dataKey="reports" stroke="hsl(40 80% 55%)" fill="hsl(40 80% 55% / 0.06)" strokeWidth={1.5} name="Reports" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Incident Breakdown + Recent Plans + Quick Actions */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 md:col-span-4 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-[13px] font-medium">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={incidentBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                    {incidentBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {incidentBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-8 lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-medium">Recent Safety Plans</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPlans.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No plans yet.</p>
            ) : (
              <div className="space-y-0">
                {recentPlans.map((p: any, i: number) => (
                  <div key={p.id} className={`flex items-center justify-between text-sm py-2.5 ${i < recentPlans.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[13px] truncate">{p.taskName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{p.group} · {p.date}</p>
                    </div>
                    <Badge variant={p.status === "approved" ? "default" : "secondary"} className="ml-3 shrink-0 text-[10px]">
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {[
              { label: "Create Safety Plan", icon: ClipboardList, href: "/safety-plan", color: "text-muted-foreground" },
              { label: "New Permit to Work", icon: FileText, href: "/permit-to-work", color: "text-muted-foreground" },
              { label: "Report Incident", icon: AlertTriangle, href: "/incidents", color: "text-muted-foreground" },
              { label: "Log Inspection", icon: HardHat, href: "/crane-inspection", color: "text-muted-foreground" },
              { label: "Draeger Calibration", icon: TestTube2, href: "/draeger-calibration", color: "text-muted-foreground" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <Icon className={`h-3.5 w-3.5 ${action.color} shrink-0`} />
                  <span className="text-[13px] text-foreground/80">{action.label}</span>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
