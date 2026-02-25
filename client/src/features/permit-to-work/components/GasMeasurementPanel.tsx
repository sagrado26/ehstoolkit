import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, Plus, Activity, Wind } from "lucide-react";

interface GasMeasurement {
  id: number;
  permitId: number;
  o2Level: string;
  co2Level: string;
  coLevel: string;
  h2sLevel: string;
  lelLevel: string;
  measuredBy: string;
  alertTriggered: string;
  notes: string | null;
  measuredAt: string;
}

// Gas thresholds
const THRESHOLDS = {
  o2: { min: 19.5, max: 23.5, unit: "%", label: "O\u2082" },
  co2: { max: 0.5, unit: "%", label: "CO\u2082" },
  co: { max: 50, unit: "ppm", label: "CO" },
  h2s: { max: 10, unit: "ppm", label: "H\u2082S" },
  lel: { max: 10, unit: "%", label: "LEL" },
};

function isLevelDangerous(gas: string, value: number): boolean {
  switch (gas) {
    case "o2": return value < THRESHOLDS.o2.min || value > THRESHOLDS.o2.max;
    case "co2": return value >= THRESHOLDS.co2.max;
    case "co": return value >= THRESHOLDS.co.max;
    case "h2s": return value >= THRESHOLDS.h2s.max;
    case "lel": return value >= THRESHOLDS.lel.max;
    default: return false;
  }
}

function GasGauge({ label, value, unit, isDangerous }: { label: string; value: string; unit: string; isDangerous: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-3 rounded-lg border transition-colors",
      isDangerous ? "bg-red-50 border-red-300" : "bg-emerald-50/50 border-emerald-200/50"
    )}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={cn("text-xl font-mono font-bold", isDangerous ? "text-red-600" : "text-emerald-700")}>
        {value || "—"}
      </span>
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

interface Props {
  permitId: number;
}

export function GasMeasurementPanel({ permitId }: Props) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    o2Level: "20.9", co2Level: "0.04", coLevel: "0",
    h2sLevel: "0", lelLevel: "0", measuredBy: "", notes: "",
  });

  const { data: measurements = [] } = useQuery<GasMeasurement[]>({
    queryKey: [`/api/permits/${permitId}/gas-measurements`],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", `/api/permits/${permitId}/gas-measurements`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/api/permits/${permitId}/gas-measurements`] });
      setShowForm(false);
      setForm({ o2Level: "20.9", co2Level: "0.04", coLevel: "0", h2sLevel: "0", lelLevel: "0", measuredBy: "", notes: "" });
      // Reset timer
      setTimeLeft(900);
      setTimerActive(true);
    },
  });

  // 15-minute countdown timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const latestReading = measurements[0];
  const hasAlert = measurements.some(m => m.alertTriggered === "yes");

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
            <Activity className="h-4.5 w-4.5 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Gas Measurements</h3>
            <p className="text-xs text-muted-foreground">{measurements.length} reading{measurements.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Timer display */}
          {timerActive && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium",
              timeLeft <= 60 ? "bg-red-100 text-red-700 animate-pulse" : "bg-amber-100 text-amber-700"
            )}>
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </div>
          )}
          {timeLeft === 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Reading Overdue
            </Badge>
          )}
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Reading
          </Button>
        </div>
      </div>

      {/* Latest readings gauges */}
      {latestReading && (
        <div className="p-4 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Latest Reading</p>
          <div className="grid grid-cols-5 gap-2">
            <GasGauge label={THRESHOLDS.o2.label} value={latestReading.o2Level} unit={THRESHOLDS.o2.unit} isDangerous={isLevelDangerous("o2", parseFloat(latestReading.o2Level))} />
            <GasGauge label={THRESHOLDS.co2.label} value={latestReading.co2Level} unit={THRESHOLDS.co2.unit} isDangerous={isLevelDangerous("co2", parseFloat(latestReading.co2Level))} />
            <GasGauge label={THRESHOLDS.co.label} value={latestReading.coLevel} unit={THRESHOLDS.co.unit} isDangerous={isLevelDangerous("co", parseFloat(latestReading.coLevel))} />
            <GasGauge label={THRESHOLDS.h2s.label} value={latestReading.h2sLevel} unit={THRESHOLDS.h2s.unit} isDangerous={isLevelDangerous("h2s", parseFloat(latestReading.h2sLevel))} />
            <GasGauge label={THRESHOLDS.lel.label} value={latestReading.lelLevel} unit={THRESHOLDS.lel.unit} isDangerous={isLevelDangerous("lel", parseFloat(latestReading.lelLevel))} />
          </div>
          {latestReading.alertTriggered === "yes" && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              ALERT: Gas levels outside safe thresholds - evacuate immediately and notify Entry Supervisor
            </div>
          )}
        </div>
      )}

      {/* New reading form */}
      {showForm && (
        <div className="p-4 border-b border-border bg-blue-50/30">
          <p className="text-sm font-semibold mb-3">Record New Gas Reading</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
            <div className="space-y-1">
              <Label className="text-xs">O₂ Level (%)</Label>
              <Input type="number" step="0.1" value={form.o2Level} onChange={e => setForm(f => ({ ...f, o2Level: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CO₂ Level (%)</Label>
              <Input type="number" step="0.01" value={form.co2Level} onChange={e => setForm(f => ({ ...f, co2Level: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CO Level (ppm)</Label>
              <Input type="number" step="1" value={form.coLevel} onChange={e => setForm(f => ({ ...f, coLevel: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">H₂S Level (ppm)</Label>
              <Input type="number" step="0.1" value={form.h2sLevel} onChange={e => setForm(f => ({ ...f, h2sLevel: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">LEL (%)</Label>
              <Input type="number" step="0.1" value={form.lelLevel} onChange={e => setForm(f => ({ ...f, lelLevel: e.target.value }))} className="h-8 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <Label className="text-xs">Measured By</Label>
              <Input value={form.measuredBy} onChange={e => setForm(f => ({ ...f, measuredBy: e.target.value }))} placeholder="Your name" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" className="h-8 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={() => createMutation.mutate(form)} disabled={!form.measuredBy || createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Save Reading"}
            </Button>
          </div>
        </div>
      )}

      {/* Reading history */}
      {measurements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-2.5 px-3 text-left font-medium text-muted-foreground">Time</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">O₂</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">CO₂</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">CO</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">H₂S</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">LEL</th>
                <th className="py-2.5 px-3 text-left font-medium text-muted-foreground">By</th>
                <th className="py-2.5 px-3 text-center font-medium text-muted-foreground">Alert</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-2 px-3 text-muted-foreground font-mono">
                    {new Date(m.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className={cn("py-2 px-3 text-center font-mono", isLevelDangerous("o2", parseFloat(m.o2Level)) && "text-red-600 font-bold")}>{m.o2Level}%</td>
                  <td className={cn("py-2 px-3 text-center font-mono", isLevelDangerous("co2", parseFloat(m.co2Level)) && "text-red-600 font-bold")}>{m.co2Level}%</td>
                  <td className={cn("py-2 px-3 text-center font-mono", isLevelDangerous("co", parseFloat(m.coLevel)) && "text-red-600 font-bold")}>{m.coLevel}</td>
                  <td className={cn("py-2 px-3 text-center font-mono", isLevelDangerous("h2s", parseFloat(m.h2sLevel)) && "text-red-600 font-bold")}>{m.h2sLevel}</td>
                  <td className={cn("py-2 px-3 text-center font-mono", isLevelDangerous("lel", parseFloat(m.lelLevel)) && "text-red-600 font-bold")}>{m.lelLevel}%</td>
                  <td className="py-2 px-3">{m.measuredBy}</td>
                  <td className="py-2 px-3 text-center">
                    {m.alertTriggered === "yes" ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">ALERT</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">OK</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {measurements.length === 0 && !showForm && (
        <div className="p-8 text-center">
          <Wind className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No gas readings recorded yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Take the first reading to start the 15-minute monitoring cycle</p>
        </div>
      )}
    </Card>
  );
}
