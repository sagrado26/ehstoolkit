import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, FileText, Eye, Loader2, X, TrendingUp } from "lucide-react";
import RiskHistoryChart from "@/components/RiskHistoryChart";

interface PermitToWork {
  id: number;
  permitNumber: string;
  title: string;
  location: string;
  workType: string;
  riskLevel: "low" | "medium" | "high";
  status: "approved" | "pending" | "expired";
  requestedBy: string;
  approvedBy: string | null;
  startDate: string;
  endDate: string;
}

const mockPtWData: PermitToWork[] = [
  {
    id: 1,
    permitNumber: "PTW-0045",
    title: "Hot Work - Welding Bay 3",
    location: "Building A - Zone 2",
    workType: "Hot Work",
    riskLevel: "high",
    status: "approved",
    requestedBy: "Mike Johnson",
    approvedBy: "Sarah Chen",
    startDate: "2026-01-05",
    endDate: "2026-01-05"
  },
  {
    id: 2,
    permitNumber: "PTW-0044",
    title: "Confined Space Entry - Tank 12",
    location: "Tank Farm",
    workType: "Confined Space",
    riskLevel: "high",
    status: "pending",
    requestedBy: "Tom Wilson",
    approvedBy: null,
    startDate: "2026-01-06",
    endDate: "2026-01-06"
  },
  {
    id: 3,
    permitNumber: "PTW-0043",
    title: "Electrical Isolation - Panel C4",
    location: "Electrical Room B",
    workType: "Electrical",
    riskLevel: "medium",
    status: "approved",
    requestedBy: "Lisa Park",
    approvedBy: "James Brown",
    startDate: "2026-01-04",
    endDate: "2026-01-04"
  },
  {
    id: 4,
    permitNumber: "PTW-0042",
    title: "Working at Heights - Roof Access",
    location: "Building C",
    workType: "Heights",
    riskLevel: "medium",
    status: "expired",
    requestedBy: "David Lee",
    approvedBy: "Sarah Chen",
    startDate: "2026-01-02",
    endDate: "2026-01-02"
  },
  {
    id: 5,
    permitNumber: "PTW-0041",
    title: "Excavation Work - Parking Lot",
    location: "External - North",
    workType: "Excavation",
    riskLevel: "low",
    status: "approved",
    requestedBy: "Anna Smith",
    approvedBy: "James Brown",
    startDate: "2026-01-03",
    endDate: "2026-01-05"
  }
];

const periods = ["1W", "1M", "6M", "1Y"];

interface RecentPtWTableProps {
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RecentPtWTable({ compact = false }: RecentPtWTableProps) {
  const [activePeriod, setActivePeriod] = useState("1M");
  const [selectedPtW, setSelectedPtW] = useState<PermitToWork | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [riskHistoryOpen, setRiskHistoryOpen] = useState(false);

  const riskColors = {
    low: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusColors = {
    approved: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    expired: "bg-muted text-muted-foreground border-muted",
  };

  const handleViewPtW = (ptw: PermitToWork) => {
    setSelectedPtW(ptw);
    setViewDialogOpen(true);
  };

  if (compact) {
    return (
      <div className="divide-y divide-card-border">
        {mockPtWData.map((ptw) => (
          <div 
            key={ptw.id} 
            className="p-3 space-y-2 cursor-pointer hover-elevate" 
            data-testid={`card-ptw-compact-${ptw.id}`}
            onClick={() => handleViewPtW(ptw)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-amber-500/10">
                  <FileText className="w-3 h-3 text-amber-600" />
                </div>
                <span className="text-xs font-medium">{ptw.permitNumber}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${riskColors[ptw.riskLevel]}`}>
                {ptw.riskLevel.charAt(0).toUpperCase() + ptw.riskLevel.slice(1)}
              </Badge>
            </div>
            
            <p className="text-sm font-medium truncate">{ptw.title}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px] bg-muted">
                    {ptw.requestedBy.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{ptw.requestedBy.split(' ')[0]}</span>
              </div>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[ptw.status]}`}>
                {ptw.status.charAt(0).toUpperCase() + ptw.status.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
        {mockPtWData.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No permits to work yet.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 lg:p-6 border-b border-card-border gap-4">
        <div>
          <h3 className="font-bold text-lg">Recent Permits to Work</h3>
          <p className="text-sm text-muted-foreground">Track active and pending work permits</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-muted/50 p-1 rounded-lg">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                  activePeriod === period 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`button-ptw-period-${period.toLowerCase()}`}
              >
                {period}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg" onClick={() => setRiskHistoryOpen(true)} data-testid="button-ptw-risk-history">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Risk History</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      <Dialog open={riskHistoryOpen} onOpenChange={setRiskHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              PtW Risk History
            </DialogTitle>
            <DialogDescription>Risk assessment trends for permits to work over time</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <RiskHistoryChart />
          </div>
        </DialogContent>
      </Dialog>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-muted/50">
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Permit #</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work Type</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk Level</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested By</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockPtWData.map((ptw) => (
              <tr 
                key={ptw.id} 
                className="border-b border-card-border hover:bg-primary/5 transition-colors cursor-pointer"
                data-testid={`row-ptw-${ptw.id}`}
                onClick={() => handleViewPtW(ptw)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-amber-500/10">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium text-sm">{ptw.permitNumber}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-sm">{ptw.title}</p>
                    <p className="text-xs text-muted-foreground">{ptw.location}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" className="text-xs">
                    {ptw.workType}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" className={`text-xs ${riskColors[ptw.riskLevel]}`}>
                    {ptw.riskLevel.charAt(0).toUpperCase() + ptw.riskLevel.slice(1)}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="outline" className={`text-xs ${statusColors[ptw.status]}`}>
                    {ptw.status.charAt(0).toUpperCase() + ptw.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-muted">
                        {ptw.requestedBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ptw.requestedBy}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {formatDate(ptw.startDate)}
                </td>
                <td className="py-4 px-6">
                  <Button variant="ghost" size="icon" data-testid={`button-view-ptw-${ptw.id}`}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {mockPtWData.map((ptw) => (
          <div 
            key={ptw.id} 
            className="p-4 border-b border-card-border hover:bg-primary/5 transition-colors cursor-pointer"
            data-testid={`card-ptw-mobile-${ptw.id}`}
            onClick={() => handleViewPtW(ptw)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-500/10">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium text-sm">{ptw.permitNumber}</span>
              </div>
              <div className="flex gap-1">
                <Badge variant="outline" className={`text-[10px] ${riskColors[ptw.riskLevel]}`}>
                  {ptw.riskLevel}
                </Badge>
                <Badge variant="outline" className={`text-[10px] ${statusColors[ptw.status]}`}>
                  {ptw.status}
                </Badge>
              </div>
            </div>
            <p className="font-medium mb-1">{ptw.title}</p>
            <p className="text-xs text-muted-foreground mb-2">{ptw.location}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px]">
                    {ptw.requestedBy.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{ptw.requestedBy}</span>
              </div>
              <span className="text-muted-foreground">{formatDate(ptw.startDate)}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader className="pb-2 border-b border-card-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                {selectedPtW?.permitNumber}
              </DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  className="w-7 h-7 rounded border-2 border-green-600 flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                  data-testid="button-close-ptw-dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
            </div>
            <DialogDescription className="sr-only">Permit to Work Details</DialogDescription>
          </DialogHeader>
          {selectedPtW && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-semibold">{selectedPtW.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedPtW.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Work Type</p>
                    <Badge variant="outline">{selectedPtW.workType}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <Badge variant="outline" className={riskColors[selectedPtW.riskLevel]}>
                      {selectedPtW.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant="outline" className={statusColors[selectedPtW.status]}>
                      {selectedPtW.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="text-sm">{formatDate(selectedPtW.startDate)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-card-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Requested By</p>
                    <p className="text-sm font-medium">{selectedPtW.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Approved By</p>
                    <p className="text-sm font-medium">{selectedPtW.approvedBy || "---"}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
