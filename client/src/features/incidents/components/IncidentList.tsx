import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortableHeader, nextSort, sortRows, type SortDir } from "@/components/ui/sortable-header";
import { ColumnToggle, useColumnVisibility, type ColumnDef } from "@/components/ui/column-toggle";
import { NameAvatar } from "@/components/ui/name-avatar";
import { useIsAdmin } from "@/hooks/use-admin";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trash2, Search, Plus, AlertTriangle, ChevronDown, X } from "lucide-react";

interface Props { onNew: () => void; }

const severityConfig: Record<number, { label: string; className: string }> = {
  1: { label: "Low", className: "bg-primary/10 text-primary border-primary/20" },
  2: { label: "Medium", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  3: { label: "High", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  4: { label: "Critical", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  investigating: { label: "Investigating", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  closed: { label: "Closed", className: "bg-primary/10 text-primary border-primary/20" },
};

const COLUMNS: ColumnDef[] = [
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "location", label: "Location" },
  { key: "severity", label: "Severity" },
  { key: "status", label: "Status" },
  { key: "investigator", label: "Investigator" },
];

const PAGE_SIZE = 10;

export function IncidentList({ onNew }: Props) {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();
  const { data: incidents = [], isLoading } = useQuery({ queryKey: ["/api/incidents"] });
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: SortDir }>({ field: "", dir: null });
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [colVisible, setColVisible] = useColumnVisibility(COLUMNS);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/incidents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/incidents"] }),
  });

  const filtered = useMemo(() => {
    return (incidents as any[]).filter(i => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (severityFilter !== "all" && String(i.severity) !== severityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          i.type?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.assignedInvestigator?.toLowerCase().includes(q) ||
          i.date?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incidents, search, statusFilter, severityFilter]);

  const sorted = useMemo(() => sortRows(filtered, sort.field, sort.dir), [filtered, sort]);
  const handleSort = (field: string) => setSort(prev => nextSort(prev.field, prev.dir, field));

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = showAll ? sorted : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const show = (key: string) => colVisible[key] !== false;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border">
        <div>
          <h1 className="text-xl font-bold">Incidents</h1>
          <p className="text-sm text-muted-foreground">
            Incident tracker &middot; {(incidents as any[]).length} record{(incidents as any[]).length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="pl-9 w-[220px]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); handleSearch(""); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button variant="outline" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          {isAdmin && (
            <ColumnToggle columns={COLUMNS} visible={colVisible} onChange={setColVisible} />
          )}
          <Button onClick={onNew} className="gap-2">
            <Plus className="h-4 w-4" /> Report Incident
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="1">1 — Low</SelectItem>
            <SelectItem value="2">2 — Medium</SelectItem>
            <SelectItem value="3">3 — High</SelectItem>
            <SelectItem value="4">4 — Critical</SelectItem>
          </SelectContent>
        </Select>
        {(statusFilter !== "all" || severityFilter !== "all") && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setStatusFilter("all"); setSeverityFilter("all"); }}>
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading incidents...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">{search || statusFilter !== "all" || severityFilter !== "all" ? "No matching incidents" : "No incidents found"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try adjusting your search or filters" : "No incidents have been reported"}
          </p>
        </div>
      ) : (
        <>
          {isMobile && (
            <div className="divide-y divide-border">
              {paged.map((i: any) => {
                const sev = severityConfig[i.severity] || severityConfig[1];
                const stat = statusConfig[i.status] || statusConfig.open;
                const isExpanded = expandedId === i.id;
                return (
                  <div key={i.id} className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => setExpandedId(isExpanded ? null : i.id)}
                    >
                      <div>
                        <p className="text-sm font-medium capitalize">{i.type?.replace("-", " ")}</p>
                        <p className="text-xs text-muted-foreground">{i.location}</p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-2 pl-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-24">Date</span>
                          <span>{i.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-24">Severity</span>
                          <Badge variant="outline" className={sev.className}>{sev.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-24">Status</span>
                          <Badge variant="outline" className={stat.className}>{stat.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-24">Investigator</span>
                          <NameAvatar name={i.assignedInvestigator} />
                        </div>
                        <div className="pt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(i.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isMobile && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {show("date") && <SortableHeader label="Date" field="date" current={sort} onSort={handleSort} />}
                    {show("type") && <SortableHeader label="Type" field="type" current={sort} onSort={handleSort} />}
                    {show("location") && <SortableHeader label="Location" field="location" current={sort} onSort={handleSort} />}
                    {show("severity") && <SortableHeader label="Severity" field="severity" current={sort} onSort={handleSort} />}
                    {show("status") && <SortableHeader label="Status" field="status" current={sort} onSort={handleSort} />}
                    {show("investigator") && <SortableHeader label="Investigator" field="assignedInvestigator" current={sort} onSort={handleSort} />}
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((i: any) => {
                    const sev = severityConfig[i.severity] || severityConfig[1];
                    const stat = statusConfig[i.status] || statusConfig.open;
                    return (
                      <tr key={i.id} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                        {show("date") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{i.date}</td>}
                        {show("type") && <td className="py-3.5 px-5 text-sm font-medium capitalize">{i.type?.replace("-", " ")}</td>}
                        {show("location") && <td className="py-3.5 px-5 text-sm">{i.location}</td>}
                        {show("severity") && (
                          <td className="py-3.5 px-5">
                            <Badge variant="outline" className={sev.className}>{sev.label}</Badge>
                          </td>
                        )}
                        {show("status") && (
                          <td className="py-3.5 px-5">
                            <Badge variant="outline" className={stat.className}>{stat.label}</Badge>
                          </td>
                        )}
                        {show("investigator") && (
                          <td className="py-3.5 px-5">
                            <NameAvatar name={i.assignedInvestigator} />
                          </td>
                        )}
                        <td className="py-3.5 px-5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(i.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <span>
            Showing {showAll ? filtered.length : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)}`} of {filtered.length} incident{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </span>
          <div className="flex items-center gap-2">
            {!showAll && totalPages > 1 && (
              <>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <span className="text-xs tabular-nums">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setShowAll(!showAll); setPage(1); }}>
              {showAll ? `Show ${PAGE_SIZE} per page` : "Show all"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
