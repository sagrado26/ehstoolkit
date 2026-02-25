import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Shield, UserCheck } from "lucide-react";
import { SignatureCapture } from "./SignatureCapture";

interface Approval {
  id: number;
  permitId: number;
  approverRole: string;
  approverName: string;
  status: string;
  comments: string | null;
  approvedAt: string | null;
  createdAt: string;
}

interface SignOff {
  id: number;
  permitId: number;
  role: string;
  signedBy: string;
  signatureData: string | null;
  signedAt: string;
}

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", label: "Pending" },
  approved: { icon: CheckCircle2, color: "text-emerald-600", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-600", label: "Rejected" },
};

interface Props {
  permitId: number;
  permitStatus: string;
}

export function ApprovalWorkflow({ permitId, permitStatus }: Props) {
  const qc = useQueryClient();
  const [activeApprovalId, setActiveApprovalId] = useState<number | null>(null);
  const [approvalForm, setApprovalForm] = useState({ approverName: "", comments: "" });
  const [signOffName, setSignOffName] = useState("");
  const [signOffRole, setSignOffRole] = useState("");

  const { data: approvals = [] } = useQuery<Approval[]>({
    queryKey: [`/api/permits/${permitId}/approvals`],
  });

  const { data: signOffs = [] } = useQuery<SignOff[]>({
    queryKey: [`/api/permits/${permitId}/sign-offs`],
  });

  const createApprovalMutation = useMutation({
    mutationFn: (data: { approverRole: string; approverName: string }) =>
      apiRequest("POST", `/api/permits/${permitId}/approvals`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/permits/${permitId}/approvals`] }),
  });

  const updateApprovalMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number; status: string; approverName: string; comments: string }) =>
      apiRequest("PATCH", `/api/permits/${permitId}/approvals/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/api/permits/${permitId}/approvals`] });
      qc.invalidateQueries({ queryKey: ["/api/permits"] });
      setActiveApprovalId(null);
      setApprovalForm({ approverName: "", comments: "" });
    },
  });

  const createSignOffMutation = useMutation({
    mutationFn: (data: { role: string; signedBy: string; signatureData?: string }) =>
      apiRequest("POST", `/api/permits/${permitId}/sign-offs`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/api/permits/${permitId}/sign-offs`] });
      setSignOffName("");
      setSignOffRole("");
    },
  });

  const handleApprovalAction = (id: number, status: "approved" | "rejected") => {
    updateApprovalMutation.mutate({
      id,
      status,
      approverName: approvalForm.approverName,
      comments: approvalForm.comments,
    });
  };

  return (
    <div className="space-y-4">
      {/* Dual Approval Section */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
            <Shield className="h-4.5 w-4.5 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Approval Workflow</h3>
            <p className="text-xs text-muted-foreground">Dual approval required: Local EHS + Responsible Manager</p>
          </div>
        </div>

        {approvals.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">No approval requests yet</p>
            {permitStatus === "pending" && (
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    createApprovalMutation.mutate({ approverRole: "Local EHS", approverName: "" });
                    createApprovalMutation.mutate({ approverRole: "Responsible Manager", approverName: "" });
                  }}
                >
                  Create Approval Requests
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {approvals.map((approval) => {
              const config = STATUS_CONFIG[approval.status] || STATUS_CONFIG.pending;
              const StatusIcon = config.icon;
              const isActive = activeApprovalId === approval.id;

              return (
                <div key={approval.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-5 w-5", config.color)} />
                      <div>
                        <p className="text-sm font-medium">{approval.approverRole}</p>
                        {approval.approverName && (
                          <p className="text-xs text-muted-foreground">{approval.approverName}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      approval.status === "approved" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      approval.status === "rejected" && "bg-red-50 text-red-700 border-red-200",
                      approval.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                    )}>
                      {config.label}
                    </Badge>
                  </div>

                  {approval.comments && (
                    <p className="text-xs text-muted-foreground mt-1 pl-7">{approval.comments}</p>
                  )}
                  {approval.approvedAt && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1 pl-7">
                      {new Date(approval.approvedAt).toLocaleString()}
                    </p>
                  )}

                  {approval.status === "pending" && (
                    <>
                      {!isActive ? (
                        <div className="flex justify-end mt-2">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => setActiveApprovalId(approval.id)}>
                            Review & Decide
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-border space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Approver Name</Label>
                            <Input
                              value={approvalForm.approverName}
                              onChange={e => setApprovalForm(f => ({ ...f, approverName: e.target.value }))}
                              placeholder="Your full name"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Comments</Label>
                            <Textarea
                              value={approvalForm.comments}
                              onChange={e => setApprovalForm(f => ({ ...f, comments: e.target.value }))}
                              placeholder="Optional comments..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setActiveApprovalId(null)}>Cancel</Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 border-red-200"
                              onClick={() => handleApprovalAction(approval.id, "rejected")}
                              disabled={!approvalForm.approverName}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleApprovalAction(approval.id, "approved")}
                              disabled={!approvalForm.approverName}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Sign-Off Section */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center">
            <UserCheck className="h-4.5 w-4.5 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Sign-Offs</h3>
            <p className="text-xs text-muted-foreground">{signOffs.length} sign-off{signOffs.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>

        {signOffs.length > 0 && (
          <div className="divide-y divide-border">
            {signOffs.map((so) => (
              <div key={so.id} className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{so.signedBy}</p>
                  <p className="text-xs text-muted-foreground">{so.role}</p>
                </div>
                <span className="text-xs text-muted-foreground/60">
                  {new Date(so.signedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-border">
          <p className="text-xs font-medium mb-3">Add Sign-Off</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input value={signOffName} onChange={e => setSignOffName(e.target.value)} placeholder="Full name" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <Input value={signOffRole} onChange={e => setSignOffRole(e.target.value)} placeholder="e.g. Entry Supervisor" className="h-8 text-sm" />
            </div>
          </div>
          <SignatureCapture
            label="Digital Signature"
            onCapture={(sigData) => {
              if (signOffName && signOffRole) {
                createSignOffMutation.mutate({ role: signOffRole, signedBy: signOffName, signatureData: sigData });
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}
