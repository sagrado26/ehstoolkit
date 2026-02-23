import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Shield } from "lucide-react";

const trendData = [
  { week: "W48", incidents: 3, hazards: 8, compliance: 92 },
  { week: "W49", incidents: 2, hazards: 6, compliance: 94 },
  { week: "W50", incidents: 4, hazards: 9, compliance: 89 },
  { week: "W51", incidents: 1, hazards: 5, compliance: 96 },
  { week: "W52", incidents: 2, hazards: 4, compliance: 95 },
  { week: "W1", incidents: 0, hazards: 3, compliance: 98 },
];

interface RiskTrendChartProps {
  compact?: boolean;
}

export default function RiskTrendChart({ compact = false }: RiskTrendChartProps) {
  const latestCompliance = trendData[trendData.length - 1].compliance;
  const latestIncidents = trendData[trendData.length - 1].incidents;
  
  if (compact) {
    return (
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-3 py-2 border-b border-card-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <h3 className="font-semibold text-xs">Risk & Compliance Trend</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground">Compliance</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-1">{latestCompliance}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Incidents</span>
              <span className="text-sm font-bold ml-1">{latestIncidents}</span>
              <TrendingDown className="w-3 h-3 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncidentsCompact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 9 }} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--card-border))',
                    borderRadius: '6px',
                    fontSize: '10px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncidentsCompact)" 
                  name="Incidents"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-card-border">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] text-muted-foreground">Incidents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground">Target: 0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Risk & Compliance Trend</h3>
              <p className="text-xs text-muted-foreground">6-week incident overview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Compliance</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{latestCompliance}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Incidents</p>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">{latestIncidents}</p>
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--card-border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="incidents" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIncidents)" 
                name="Incidents"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-card-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">Incidents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Target: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
