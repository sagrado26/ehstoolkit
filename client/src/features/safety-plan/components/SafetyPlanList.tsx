import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SortableHeader, nextSort, sortRows, type SortDir } from "@/components/ui/sortable-header";
import { ColumnToggle, useColumnVisibility, type ColumnDef } from "@/components/ui/column-toggle";
import { NameAvatar } from "@/components/ui/name-avatar";
import { useIsAdmin } from "@/hooks/use-admin";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Search, Plus, FileText, Clock, CheckCircle, XCircle, ChevronDown, X } from "lucide-react";

interface Props {
  onNew: () => void;
  onEdit: (id: number) => void;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; label: string; className: string }> = {
  approved: { icon: CheckCircle, label: "Approved", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { icon: Clock, label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  draft: { icon: FileText, label: "Draft", className: "bg-muted text-muted-foreground border-border" },
};

const COLUMNS: ColumnDef[] = [
  { key: "plan", label: "Plan" },
  { key: "task", label: "Task" },
  { key: "group", label: "Group" },
  { key: "date", label: "Date" },
  { key: "lead", label: "Lead" },
  { key: "version", label: "Version" },
  { key: "status", label: "Status" },
];

const PAGE_SIZE = 10;

export function SafetyPlanList({ onNew, onEdit }: Props) {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();
  const { data: plans = [], isLoading } = useQuery({ queryKey: ["/api/safety-plans"] });
  const { data: auditLogs = [] } = useQuery({ queryKey: ["/api/audit-logs"] });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: SortDir }>({ field: "", dir: null });
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [colVisible, setColVisible] = useColumnVisibility(COLUMNS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/safety-plans/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/safety-plans"] }),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return plans as any[];
    const q = search.toLowerCase();
    return (plans as any[]).filter(p =>
      p.taskName?.toLowerCase().includes(q) ||
      p.group?.toLowerCase().includes(q) ||
      p.leadName?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.machineNumber?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
  }, [plans, search]);

  const sorted = useMemo(() => sortRows(filtered, sort.field, sort.dir), [filtered, sort]);

  const versionCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    (auditLogs as any[]).forEach(log => {
      if (log.action === "edited") {
        counts[log.safetyPlanId] = (counts[log.safetyPlanId] || 1) + 1;
      }
    });
    return counts;
  }, [auditLogs]);

  /* rule: rerender-functional-setstate — stable callback refs */
  const handleSort = useCallback((field: string) => setSort(prev => nextSort(prev.field, prev.dir, field)), []);
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = showAll ? sorted : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const show = (key: string) => colVisible[key] !== false;

  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border bg-slate-50/50">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Integrated Safety Plans</h1>
          <p className="text-sm text-muted-foreground">
            Manage and review active risk assessments &middot; {(plans as any[]).length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!searchOpen ? (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search plans..."
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!search.trim()) setSearchOpen(false);
                    }, 200);
                  }}
                  className="pl-9 w-[220px]"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => { setSearch(""); setSearchOpen(false); setPage(1); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {isAdmin && (
            <ColumnToggle columns={COLUMNS} visible={colVisible} onChange={setColVisible} />
          )}
          <Button onClick={onNew} className="gap-2 bg-brand-dark hover:bg-brand-dark/90">
            <Plus className="h-4 w-4" /> New Plan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading safety plans...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">{search ? "No matching plans" : "No safety plans yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try adjusting your search terms" : "Create one to get started"}
          </p>
        </div>
      ) : (
        <>
          {isMobile && paged.length > 0 && (
            <div className="divide-y divide-border">
              {paged.map((p: any) => {
                const status = statusConfig[p.status] || statusConfig.draft;
                const StatusIcon = status.icon;
                const version = versionCounts[p.id] || 1;
                const isExpanded = expandedId === p.id;
                return (
                  <div key={p.id} className="bg-background list-row-virtualized">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-primary/5 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.taskName}</p>
                        <p className="text-xs text-muted-foreground">ISP-{String(p.id).padStart(4, '0')}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`gap-1 ${status.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Group</span>
                          <span>{p.group || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{p.date || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Lead</span>
                          <NameAvatar name={p.leadName} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Version</span>
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">v{version}.0</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => onEdit(p.id)}
                          >
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={e => { e.stopPropagation(); setDeleteTarget({ id: p.id, name: p.taskName || `ISP-${String(p.id).padStart(4, '0')}` }); }}
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
                    {show("plan") && <SortableHeader label="Plan" field="id" current={sort} onSort={handleSort} />}
                    {show("task") && <SortableHeader label="Task" field="taskName" current={sort} onSort={handleSort} />}
                    {show("group") && <SortableHeader label="Group" field="group" current={sort} onSort={handleSort} />}
                    {show("date") && <SortableHeader label="Date" field="date" current={sort} onSort={handleSort} />}
                    {show("lead") && <SortableHeader label="Lead" field="leadName" current={sort} onSort={handleSort} />}
                    {show("version") && <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Version</th>}
                    {show("status") && <SortableHeader label="Status" field="status" current={sort} onSort={handleSort} />}
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p: any) => {
                    const status = statusConfig[p.status] || statusConfig.draft;
                    const StatusIcon = status.icon;
                    const version = versionCounts[p.id] || 1;
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-primary/5 cursor-pointer transition-all table-row-virtualized group/row"
                        onClick={() => onEdit(p.id)}
                      >
                        {show("plan") && (
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-md bg-primary/10">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="text-sm font-medium">ISP-{String(p.id).padStart(4, '0')}</span>
                            </div>
                          </td>
                        )}
                        {show("task") && (
                          <td className="py-3.5 px-5">
                            <p className="text-sm font-medium truncate max-w-[200px]">{p.taskName}</p>
                            <p className="text-xs text-muted-foreground">{p.location}</p>
                          </td>
                        )}
                        {show("group") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{p.group}</td>}
                        {show("date") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{p.date}</td>}
                        {show("lead") && (
                          <td className="py-3.5 px-5">
                            <NameAvatar name={p.leadName} />
                          </td>
                        )}
                        {show("version") && (
                          <td className="py-3.5 px-5">
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              v{version}.0
                            </span>
                          </td>
                        )}
                        {show("status") && (
                          <td className="py-3.5 px-5">
                            <Badge variant="outline" className={`gap-1 ${status.className}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </td>
                        )}
                        <td className="py-3.5 px-5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={e => { e.stopPropagation(); setDeleteTarget({ id: p.id, name: p.taskName || `ISP-${String(p.id).padStart(4, '0')}` }); }}
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
            Showing {showAll ? filtered.length : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)}`} of {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
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
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete safety plan?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
