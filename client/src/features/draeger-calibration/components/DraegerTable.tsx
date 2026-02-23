import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import type { DraegerCalibrationData } from "../types";

const empty: DraegerCalibrationData = { nc12: "", serialNumber: "", calibrationDate: "", calibratedBy: "" };

export function DraegerTable() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["/api/draeger-calibrations"] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<DraegerCalibrationData>(empty);
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<DraegerCalibrationData>(empty);

  const createMutation = useMutation({
    mutationFn: (data: DraegerCalibrationData) => apiRequest("POST", "/api/draeger-calibrations", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/draeger-calibrations"] }); setIsAdding(false); setNewRow(empty); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DraegerCalibrationData> }) =>
      apiRequest("PATCH", `/api/draeger-calibrations/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/draeger-calibrations"] }); setEditingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/draeger-calibrations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/draeger-calibrations"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Draeger Calibration</h1>
          <p className="text-sm text-muted-foreground">Manage calibration records</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-1" /> Add Entry
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>12NC</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Calibration Date</TableHead>
            <TableHead>Calibrated By</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              {(["nc12", "serialNumber", "calibrationDate", "calibratedBy"] as const).map(f => (
                <TableCell key={f}>
                  <Input
                    value={newRow[f]}
                    type={f === "calibrationDate" ? "date" : "text"}
                    onChange={e => setNewRow(prev => ({ ...prev, [f]: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" className="h-7 w-7" onClick={() => createMutation.mutate(newRow)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setIsAdding(false); setNewRow(empty); }}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {isLoading ? null : (rows as any[]).map(row => (
            <TableRow key={row.id}>
              {editingId === row.id ? (
                <>
                  {(["nc12", "serialNumber", "calibrationDate", "calibratedBy"] as const).map(f => (
                    <TableCell key={f}>
                      <Input value={editData[f]} type={f === "calibrationDate" ? "date" : "text"}
                        onChange={e => setEditData(prev => ({ ...prev, [f]: e.target.value }))}
                        className="h-8 text-sm" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" className="h-7 w-7" onClick={() => updateMutation.mutate({ id: row.id, data: editData })}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-sm">{row.nc12}</TableCell>
                  <TableCell className="text-sm">{row.serialNumber}</TableCell>
                  <TableCell className="text-sm">{row.calibrationDate}</TableCell>
                  <TableCell className="text-sm">{row.calibratedBy}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={() => { setEditingId(row.id); setEditData({ nc12: row.nc12, serialNumber: row.serialNumber, calibrationDate: row.calibrationDate, calibratedBy: row.calibratedBy }); }}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMutation.mutate(row.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {!isLoading && (rows as any[]).length === 0 && !isAdding && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-12">
                No calibration records yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
