import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ClipboardList, FileText, HardHat, AlertTriangle,
  ArrowUpRight, TrendingUp, ShieldCheck, TestTube2,
  Search, Plus, Users, Clock, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Link } from "wouter";
import { motion } from "framer-motion";

const cultureTrendData = [
  { month: "Sep", score: 42, reports: 8 },
  { month: "Oct", score: 44, reports: 11 },
  { month: "Nov", score: 40, reports: 9 },
  { month: "Dec", score: 45, reports: 14 },
  { month: "Jan", score: 47, reports: 12 },
  { month: "Feb", score: 49, reports: 10 },
];

const PRIMARY = "hsl(var(--primary))";
const PRIMARY_FG = "hsl(var(--primary-foreground))";
const CHART_COLORS = {
  orange: "#E8590C",
  emerald: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  teal: "#288498",
  blue: "#3b82f6",
  slate: "#64748b",
};

const INCIDENT_TYPE_COLORS: Record<string, string> = {
  "near-miss": CHART_COLORS.amber,
  "injury": CHART_COLORS.red,
  "property-damage": CHART_COLORS.blue,
  "environmental": CHART_COLORS.teal,
};

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  "near-miss": "Near Miss",
  "injury": "Injury",
  "property-damage": "Property",
  "environmental": "Environmental",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function DashboardPage() {
  const [
    { data: plans = [] },
    { data: permits = [] },
    { data: incidents = [] },
    { data: craneInspections = [] },
    { data: draegerCalibrations = [] },
  ] = useQueries({
    queries: [
      { queryKey: ["/api/safety-plans"] },
      { queryKey: ["/api/permits"] },
      { queryKey: ["/api/incidents"] },
      { queryKey: ["/api/crane-inspections"] },
      { queryKey: ["/api/draeger-calibrations"] },
    ],
  });

  const activePlans = useMemo(
    () => (plans as any[]).filter(p => p.status !== "approved" && p.status !== "rejected").length,
    [plans],
  );
  const openPermits = useMemo(
    () => (permits as any[]).filter(p => p.status !== "approved").length,
    [permits],
  );
  const openIncidents = useMemo(
    () => (incidents as any[]).filter((i: any) => i.status !== "closed").length,
    [incidents],
  );
  const craneCount = useMemo(() => (craneInspections as any[]).length, [craneInspections]);
  const draegerCount = useMemo(() => (draegerCalibrations as any[]).length, [draegerCalibrations]);

  const safetyIndex = useMemo(() => {
    const allPlans = plans as any[];
    const allPermits = permits as any[];
    const allIncidents = incidents as any[];
    const total = allPlans.length + allPermits.length + allIncidents.length;
    if (total === 0) return 49;
    const resolved =
      allPlans.filter(p => p.status === "approved").length +
      allPermits.filter(p => p.status === "approved").length +
      allIncidents.filter(i => i.status === "closed").length;
    return Math.round((resolved / total) * 100);
  }, [plans, permits, incidents]);

  const correctiveActions = useMemo(() => {
    const all = incidents as any[];
    return {
      completed: all.filter(i => i.status === "closed").length,
      inProgress: all.filter(i => i.status === "investigating").length,
      overdue: all.filter(i => i.status === "open").length,
    };
  }, [incidents]);

  const correctiveBarData = useMemo(() => {
    const allPlans = plans as any[];
    const allPermits = permits as any[];
    const allIncidents = incidents as any[];
    const allEquipment = [...(craneInspections as any[]), ...(draegerCalibrations as any[])];
    return [
      { name: "Plans", completed: allPlans.filter(p => p.status === "approved").length, inProgress: allPlans.filter(p => p.status === "pending").length, overdue: allPlans.filter(p => p.status === "draft" || p.status === "rejected").length },
      { name: "Permits", completed: allPermits.filter(p => p.status === "approved").length, inProgress: allPermits.filter(p => p.status === "pending").length, overdue: allPermits.filter(p => p.status === "draft").length },
      { name: "Incidents", completed: allIncidents.filter(i => i.status === "closed").length, inProgress: allIncidents.filter(i => i.status === "investigating").length, overdue: allIncidents.filter(i => i.status === "open").length },
      { name: "Equipment", completed: allEquipment.filter((e: any) => e.status === "submitted" || e.calibrationDate).length, inProgress: 0, overdue: allEquipment.filter((e: any) => e.status === "draft").length },
    ];
  }, [plans, permits, incidents, craneInspections, draegerCalibrations]);

  const incidentsByType = useMemo(() => {
    const all = incidents as any[];
    const counts: Record<string, number> = {};
    all.forEach(i => { counts[i.type] = (counts[i.type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({
      name: INCIDENT_TYPE_LABELS[type] || type,
      value: count,
      type,
    }));
  }, [incidents]);

  const recentPlans = useMemo(() => {
    return (plans as any[])
      .slice()
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 4);
  }, [plans]);

  const tooltipStyle = {
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    fontSize: "12px",
  };

  const metrics = [
    { href: "/safety-plan", label: "Active Plans", value: activePlans, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { href: "/permit-to-work", label: "Open Permits", value: openPermits, icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { href: "/incidents", label: "Incidents", value: openIncidents, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
    { href: "/crane-inspection", label: "Crane Checks", value: craneCount, icon: HardHat, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/30" },
    { href: "/draeger-calibration", label: "Calibrations", value: draegerCount, icon: TestTube2, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ] as const;

  return (
    <motion.div
      className="space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── ISP Gradient Banner ── */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-xl shadow-lg"
          style={{
            background: "linear-gradient(135deg, #0A1A6B 0%, #0F238C 40%, #1E3AAF 70%, #2952CC 100%)",
          }}
        >
          {/* Glass overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/10" />
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <div className="relative z-10 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left: title + subtitle */}
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-white leading-tight">
                    ISP &ndash; Integrated Safety Plan
                  </h2>
                  <p className="text-sm text-white/60 mt-0.5">
                    Your last minute risk assessment &mdash; Plan, assess, and manage safety in one place
                  </p>
                </div>
              </div>

              {/* Right: search + new plan button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <Input
                    type="search"
                    placeholder="Search safety plans..."
                    className="pl-9 h-9 w-56 text-xs bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30"
                  />
                </div>
                <Link href="/safety-plan">
                  <Button className="bg-white text-primary hover:bg-white/90 font-semibold h-9 px-4 text-sm gap-2 shadow-md">
                    <Plus className="w-4 h-4" />
                    New Plan
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/50">Safety Index</span>
                <span className="text-sm font-bold text-white font-mono">{safetyIndex}</span>
                <span className="text-[10px] text-white/30 font-mono">/100</span>
                <div className="flex items-center gap-1 ml-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-emerald-400">+4.2%</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/50">Active Teams</span>
                <span className="text-sm font-bold text-white font-mono">{activePlans}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/50">Overdue Reviews</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{correctiveActions.overdue}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Metric Cards Row ── */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        variants={fadeUp}
      >
        {metrics.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="border border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bg} shrink-0 group-hover:scale-105 transition-transform`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-foreground font-mono leading-none">{card.value}</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5 leading-tight truncate">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Corrective Actions */}
        <motion.div variants={fadeUp}>
          <Card className="shadow-sm h-full border-border/60">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Corrective Actions</CardTitle>
                <Link href="/incidents">
                  <span className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 cursor-pointer">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {[
                  { label: "Completed", value: correctiveActions.completed, color: CHART_COLORS.emerald, bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400" },
                  { label: "In Progress", value: correctiveActions.inProgress, color: CHART_COLORS.amber, bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400" },
                  { label: "Overdue", value: correctiveActions.overdue, color: CHART_COLORS.red, bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400" },
                ].map(pill => (
                  <div key={pill.label} className={`flex items-center gap-1.5 rounded-full ${pill.bg} px-2.5 py-1`}>
                    <span className="text-sm font-bold font-mono" style={{ color: pill.color }}>{pill.value}</span>
                    <span className={`text-[10px] font-semibold ${pill.text}`}>{pill.label}</span>
                  </div>
                ))}
              </div>
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correctiveBarData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} allowDecimals={false} width={24} />
                    <Tooltip contentStyle={{ ...tooltipStyle, background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="completed" name="Completed" fill={CHART_COLORS.emerald} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="inProgress" name="In Progress" fill={CHART_COLORS.amber} radius={[3, 3, 0, 0]} />
                    <Bar dataKey="overdue" name="Overdue" fill={CHART_COLORS.red} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health & Safety Culture Trend */}
        <motion.div variants={fadeUp}>
          <Card className="shadow-sm h-full border-border/60">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold">
                Health &amp; Safety Culture Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-0">
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cultureTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} domain={[0, 100]} width={28} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={28} />
                    <Tooltip contentStyle={{ ...tooltipStyle, background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                    <Legend verticalAlign="top" align="right" iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "10px", paddingBottom: "8px" }} />
                    <Line yAxisId="left" type="monotone" dataKey="score" name="Score" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 3, fill: PRIMARY, stroke: PRIMARY_FG, strokeWidth: 2 }} activeDot={{ r: 5, fill: PRIMARY, stroke: PRIMARY_FG, strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="reports" name="Reports" stroke={CHART_COLORS.orange} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2.5, fill: CHART_COLORS.orange, stroke: PRIMARY_FG, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Donut + Recent Plans ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Incidents by Type */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="shadow-sm h-full border-border/60">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-sm font-bold">Incidents by Type</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-0">
              {incidentsByType.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No incidents recorded</p>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-[160px] w-[160px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={incidentsByType} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {incidentsByType.map((entry) => (
                            <Cell key={entry.type} fill={INCIDENT_TYPE_COLORS[entry.type] || CHART_COLORS.slate} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ ...tooltipStyle, background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {incidentsByType.map((entry) => (
                      <div key={entry.type} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: INCIDENT_TYPE_COLORS[entry.type] || CHART_COLORS.slate }} />
                        <span className="text-xs text-muted-foreground truncate flex-1">{entry.name}</span>
                        <span className="text-xs font-bold text-foreground font-mono">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Safety Plans */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <Card className="shadow-sm h-full border-border/60">
            <CardHeader className="pb-1 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Recent Safety Plans</CardTitle>
                <Link href="/safety-plan">
                  <span className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 cursor-pointer">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-2 pt-0">
              <div className="divide-y divide-border">
                {recentPlans.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-5 py-4">No safety plans yet</p>
                ) : (
                  recentPlans.map((plan: any) => {
                    const statusStyles: Record<string, { label: string; className: string }> = {
                      approved: { label: "approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" },
                      pending: { label: "pending", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800" },
                      draft: { label: "draft", className: "bg-muted text-muted-foreground border-border" },
                      rejected: { label: "rejected", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800" },
                    };
                    const st = statusStyles[plan.status] || statusStyles.draft;
                    return (
                      <Link key={plan.id} href="/safety-plan">
                        <div className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{plan.taskName || `Plan #${plan.id}`}</p>
                            <p className="text-[11px] text-muted-foreground">{plan.region || plan.location} &middot; {plan.date}</p>
                          </div>
                          <Badge variant="outline" className={`ml-3 shrink-0 text-[10px] font-semibold ${st.className}`}>
                            {st.label}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
