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
import { Trash2, Search, Plus, FileText, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { onNew: () => void; }

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  draft: "bg-muted text-muted-foreground border-border",
};

const WORK_TYPE_COLORS: Record<string, string> = {
  "Hot Work": "bg-red-500/10 text-red-600",
  "Electrical": "bg-amber-500/10 text-amber-600",
  "Confined Space": "bg-purple-500/10 text-purple-600",
  "Working at Height": "bg-blue-500/10 text-blue-600",
  "Cold Work": "bg-sky-500/10 text-sky-600",
  "Mechanical": "bg-orange-500/10 text-orange-600",
};

const COLUMNS: ColumnDef[] = [
  { key: "date", label: "Date" },
  { key: "workType", label: "Work Type" },
  { key: "location", label: "Location" },
  { key: "submitter", label: "Submitter" },
  { key: "manager", label: "Manager" },
  { key: "status", label: "Status" },
];

const PAGE_SIZE = 10;

export function PermitList({ onNew }: Props) {
  const qc = useQueryClient();
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();
  const { data: permits = [], isLoading } = useQuery({ queryKey: ["/api/permits"] });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: SortDir }>({ field: "", dir: null });
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [colVisible, setColVisible] = useColumnVisibility(COLUMNS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/permits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/permits"] }),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return permits as any[];
    const q = search.toLowerCase();
    return (permits as any[]).filter(p =>
      p.submitter?.toLowerCase().includes(q) ||
      p.manager?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.workType?.toLowerCase().includes(q) ||
      p.date?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    );
  }, [permits, search]);

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
          <h1 className="text-xl font-bold">Permit to Work</h1>
          <p className="text-sm text-muted-foreground">
            Manage and issue work permits &middot; {(permits as any[]).length} record{(permits as any[]).length !== 1 ? "s" : ""}
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
                  placeholder="Search permits..."
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
          <Button onClick={onNew} className="gap-2">
            <Plus className="h-4 w-4" /> New Permit
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading permits...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">{search ? "No matching permits" : "No permits yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try adjusting your search terms" : "Create one to get started"}
          </p>
        </div>
      ) : (
        <>
          {isMobile && paged.length > 0 && (
            <div className="divide-y divide-border">
              {paged.map((p: any) => {
                const isExpanded = expandedId === p.id;
                return (
                  <div key={p.id} className="bg-background">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-primary/5 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.workType || "—"}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.location || "—"}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={STATUS_STYLES[p.status] ?? "bg-muted"}>
                          {p.status === "approved" ? "Issued" : p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{p.date || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Submitter</span>
                          <NameAvatar name={p.submitter} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Manager</span>
                          <NameAvatar name={p.manager} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant="outline" className={STATUS_STYLES[p.status] ?? "bg-muted"}>
                            {p.status === "approved" ? "Issued" : p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(p.id)}
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
                    {show("workType") && <SortableHeader label="Work Type" field="workType" current={sort} onSort={handleSort} />}
                    {show("location") && <SortableHeader label="Location" field="location" current={sort} onSort={handleSort} />}
                    {show("submitter") && <SortableHeader label="Submitter" field="submitter" current={sort} onSort={handleSort} />}
                    {show("manager") && <SortableHeader label="Manager" field="manager" current={sort} onSort={handleSort} />}
                    {show("status") && <SortableHeader label="Status" field="status" current={sort} onSort={handleSort} />}
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p: any) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                      {show("date") && <td className="py-3.5 px-5 text-sm text-muted-foreground">{p.date}</td>}
                      {show("workType") && (
                        <td className="py-3.5 px-5">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", WORK_TYPE_COLORS[p.workType] ?? "bg-muted text-muted-foreground")}>
                            {p.workType || "—"}
                          </span>
                        </td>
                      )}
                      {show("location") && <td className="py-3.5 px-5 text-sm truncate max-w-[160px]">{p.location || "—"}</td>}
                      {show("submitter") && (
                        <td className="py-3.5 px-5">
                          <NameAvatar name={p.submitter} />
                        </td>
                      )}
                      {show("manager") && (
                        <td className="py-3.5 px-5">
                          <NameAvatar name={p.manager} />
                        </td>
                      )}
                      {show("status") && (
                        <td className="py-3.5 px-5">
                          <Badge variant="outline" className={STATUS_STYLES[p.status] ?? "bg-muted"}>
                            {p.status === "approved" ? "Issued" : p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                          </Badge>
                        </td>
                      )}
                      <td className="py-3.5 px-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(p.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <span>
            Showing {showAll ? filtered.length : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)}`} of {filtered.length} permit{filtered.length !== 1 ? "s" : ""}
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
