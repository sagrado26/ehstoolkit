import { useState, useMemo } from "react";
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
import { Trash2, Search, Plus, HardHat, ChevronDown, X } from "lucide-react";

interface Props { onNew: () => void; }

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-primary/10 text-primary border-primary/20" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

const COLUMNS: ColumnDef[] = [
  { key: "inspector", label: "Inspector" },
  { key: "buddy", label: "Buddy" },
  { key: "machine", label: "Machine" },
  { key: "bay", label: "Bay" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

const PAGE_SIZE = 10;

export function CraneInspectionList({ onNew }: Props) {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();
  const { data: inspections = [], isLoading } = useQuery({ queryKey: ["/api/crane-inspections"] });
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sort, setSort] = useState<{ field: string; dir: SortDir }>({ field: "", dir: null });
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [colVisible, setColVisible] = useColumnVisibility(COLUMNS);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/crane-inspections/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/crane-inspections"] }),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return inspections as any[];
    const q = search.toLowerCase();
    return (inspections as any[]).filter(ins =>
      ins.inspector?.toLowerCase().includes(q) ||
      ins.buddyInspector?.toLowerCase().includes(q) ||
      ins.machine?.toLowerCase().includes(q) ||
      ins.bay?.toLowerCase().includes(q) ||
      ins.date?.toLowerCase().includes(q) ||
      ins.status?.toLowerCase().includes(q)
    );
  }, [inspections, search]);

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
          <h1 className="text-xl font-bold">Crane Inspections</h1>
          <p className="text-sm text-muted-foreground">
            Pre-use inspection records &middot; {(inspections as any[]).length} record{(inspections as any[]).length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inspections..."
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
            <Plus className="h-4 w-4" /> New Inspection
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading inspections...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <HardHat className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">{search ? "No matching inspections" : "No inspections yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try adjusting your search terms" : "Create one to get started"}
          </p>
        </div>
      ) : (
        <>
          {isMobile && (
            <div className="divide-y divide-border">
              {paged.map((ins: any) => {
                const status = statusConfig[ins.status] || statusConfig.draft;
                const isExpanded = expandedId === ins.id;
                return (
                  <div key={ins.id} className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => setExpandedId(isExpanded ? null : ins.id)}
                    >
                      <div>
                        <p className="text-sm font-medium">{ins.machine}</p>
                        <p className="text-xs text-muted-foreground">{ins.inspector}</p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-2 pl-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-20">Buddy</span>
                          <NameAvatar name={ins.buddyInspector} />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-20">Bay</span>
                          <span>{ins.bay}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-20">Date</span>
                          <span>{ins.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-20">Status</span>
                          <Badge variant="outline" className={status.className}>{status.label}</Badge>
                        </div>
                        <div className="pt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(ins.id)}
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
                    {show("inspector") && <SortableHeader label="Inspector" field="inspector" current={sort} onSort={handleSort} />}
                    {show("buddy") && <SortableHeader label="Buddy" field="buddyInspector" current={sort} onSort={handleSort} />}
                    {show("machine") && <SortableHeader label="Machine" field="machine" current={sort} onSort={handleSort} />}
                    {show("bay") && <SortableHeader label="Bay" field="bay" current={sort} onSort={handleSort} />}
                    {show("date") && <SortableHeader label="Date" field="date" current={sort} onSort={handleSort} />}
                    {show("status") && <SortableHeader label="Status" field="status" current={sort} onSort={handleSort} />}
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((ins: any) => {
                    const status = statusConfig[ins.status] || statusConfig.draft;
                    return (
                      <tr key={ins.id} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                        {show("inspector") && (
                          <td className="py-3.5 px-5">
                            <NameAvatar name={ins.inspector} />
                          </td>
                        )}
                        {show("buddy") && (
                          <td className="py-3.5 px-5">
                            <NameAvatar name={ins.buddyInspector} />
                          </td>
                        )}
                        {show("machine") && <td className="py-3.5 px-5 text-sm">{ins.machine}</td>}
                        {show("bay") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{ins.bay}</td>}
                        {show("date") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{ins.date}</td>}
                        {show("status") && (
                          <td className="py-3.5 px-5">
                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                          </td>
                        )}
                        <td className="py-3.5 px-5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(ins.id)}
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
            Showing {showAll ? filtered.length : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)}`} of {filtered.length} inspection{filtered.length !== 1 ? "s" : ""}
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
