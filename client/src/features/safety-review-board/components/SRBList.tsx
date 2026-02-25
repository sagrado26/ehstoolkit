import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldAlert, FileText } from "lucide-react";
import type { SRBRecord, SafetyPlan } from "@shared/schema";

interface Props {
  onViewRecord: (id: number) => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function SRBList({ onViewRecord }: Props) {
  const { data: records = [] } = useQuery<SRBRecord[]>({ queryKey: ["/api/srb-records"] });
  const { data: plans = [] } = useQuery<SafetyPlan[]>({ queryKey: ["/api/safety-plans"] });

  const getPlanName = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    return plan?.taskName || `Plan #${planId}`;
  };

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ShieldAlert className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
        <h3 className="text-sm font-semibold text-muted-foreground mb-1">No SRB Records</h3>
        <p className="text-xs text-muted-foreground/60">Safety Review Board records will appear here when safety plans with high-risk hazards are escalated.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
          <ShieldAlert className="h-4.5 w-4.5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">Safety Review Board</h2>
          <p className="text-xs text-muted-foreground">{records.length} SRB record{records.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border border-border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Safety Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Service Order</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Hazards</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((r) => (
              <tr
                key={r.id}
                onClick={() => onViewRecord(r.id)}
                className="cursor-pointer hover:bg-brand/[0.03] transition-colors group/row"
              >
                <td className="px-4 py-3 font-mono text-xs">SRB-{String(r.id).padStart(3, "0")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium truncate max-w-[200px]">{getPlanName(r.safetyPlanId)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.serviceOrderNumber || "—"}</td>
                <td className="px-4 py-3 text-xs">{(r.escalatedHazards || []).length} escalated</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cn("text-[10px] capitalize", STATUS_STYLES[r.status])}>
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {records.map((r) => (
          <Card
            key={r.id}
            onClick={() => onViewRecord(r.id)}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold">SRB-{String(r.id).padStart(3, "0")}</span>
              <Badge variant="outline" className={cn("text-[10px] capitalize", STATUS_STYLES[r.status])}>
                {r.status}
              </Badge>
            </div>
            <p className="text-sm font-medium truncate">{getPlanName(r.safetyPlanId)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(r.escalatedHazards || []).length} escalated hazard{(r.escalatedHazards || []).length !== 1 ? "s" : ""}
              {r.serviceOrderNumber ? ` · ${r.serviceOrderNumber}` : ""}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
