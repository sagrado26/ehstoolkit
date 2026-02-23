import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const chartData = [
  { month: "Jan", lowRisk: 45, mediumRisk: 20, highRisk: 8 },
  { month: "Feb", lowRisk: 52, mediumRisk: 18, highRisk: 5 },
  { month: "Mar", lowRisk: 48, mediumRisk: 25, highRisk: 10 },
  { month: "Apr", lowRisk: 55, mediumRisk: 22, highRisk: 7 },
  { month: "May", lowRisk: 60, mediumRisk: 19, highRisk: 6 },
  { month: "Jun", lowRisk: 58, mediumRisk: 24, highRisk: 9 },
  { month: "Jul", lowRisk: 65, mediumRisk: 21, highRisk: 5 },
  { month: "Aug", lowRisk: 62, mediumRisk: 18, highRisk: 4 },
  { month: "Sep", lowRisk: 70, mediumRisk: 16, highRisk: 3 },
  { month: "Oct", lowRisk: 68, mediumRisk: 20, highRisk: 6 },
  { month: "Nov", lowRisk: 72, mediumRisk: 15, highRisk: 4 },
  { month: "Dec", lowRisk: 75, mediumRisk: 12, highRisk: 3 },
];

const periods = ["1W", "1M", "6M", "1Y"];

interface RiskHistoryChartProps {
  compact?: boolean;
}

function InlineLegend() {
  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span>Risk: Low</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span>Risk: Medium</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span>Risk: High</span>
      </div>
    </div>
  );
}

export default function RiskHistoryChart({ compact = false }: RiskHistoryChartProps) {
  const [activePeriod, setActivePeriod] = useState("1Y");

  if (compact) {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lowRiskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mediumRiskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="highRiskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const label = name === 'lowRisk' ? 'Risk: Low' : name === 'mediumRisk' ? 'Risk: Medium' : 'Risk: High';
                return [value, label];
              }}
            />
            <Area
              type="monotone"
              dataKey="lowRisk"
              name="lowRisk"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fill="url(#lowRiskGradient)"
            />
            <Area
              type="monotone"
              dataKey="mediumRisk"
              name="mediumRisk"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              fill="url(#mediumRiskGradient)"
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              name="highRisk"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fill="url(#highRiskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border p-4 lg:p-6 rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 lg:mb-6 gap-4">
        <div>
          <h3 className="font-semibold text-lg">Calculated Risk History</h3>
          <p className="text-sm text-muted-foreground hidden sm:block">Risk assessment trends over time</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Legend positioned next to period buttons */}
          <InlineLegend />
          <div className="flex border border-border rounded-md overflow-hidden">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  activePeriod === period 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
                data-testid={`button-risk-period-${period.toLowerCase()}`}
              >
                {period}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      <div className="h-56 sm:h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lowRiskGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mediumRiskGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="highRiskGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const label = name === 'lowRisk' ? 'Risk: Low' : name === 'mediumRisk' ? 'Risk: Medium' : 'Risk: High';
                return [value, label];
              }}
            />
            <Area
              type="monotone"
              dataKey="lowRisk"
              name="lowRisk"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fill="url(#lowRiskGradientFull)"
            />
            <Area
              type="monotone"
              dataKey="mediumRisk"
              name="mediumRisk"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              fill="url(#mediumRiskGradientFull)"
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              name="highRisk"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fill="url(#highRiskGradientFull)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
