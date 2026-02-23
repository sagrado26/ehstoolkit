import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, Shield, CheckCircle2, XCircle, Circle } from "lucide-react";
import type { PermitFormData, PermitTab } from "../types";

const schema = z.object({
  date: z.string().min(1, "Required"),
  submitter: z.string().min(1, "Required"),
  manager: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  workType: z.enum(["Hot Work", "Cold Work", "Electrical", "Working at Height", "Confined Space", "Mechanical"]),
  workDescription: z.string().min(1, "Required"),
  spq1: z.enum(["yes", "no"]),
  spq2: z.enum(["yes", "no"]),
  spq3: z.enum(["yes", "no"]),
  spq4: z.enum(["yes", "no"]),
  spq5: z.enum(["yes", "no"]),
  authorityName: z.string(),
  status: z.enum(["draft", "pending", "approved"]),
});

const SAFETY_QUESTIONS = [
  { key: "spq1" as const, text: "Where necessary, appropriate fire alarm zones / sprinkler systems have been isolated?" },
  { key: "spq2" as const, text: "Fire and emergency procedures have been communicated to all personnel on site?" },
  { key: "spq3" as const, text: "Appropriate fire fighting equipment is in place and accessible?" },
  { key: "spq4" as const, text: "Method for raising the alarm has been agreed and communicated?" },
  { key: "spq5" as const, text: "Where possible, combustible / flammable materials have been removed from the area of work?" },
];

const TABS: { id: PermitTab; label: string; icon: typeof FileText }[] = [
  { id: "details", label: "Permit Details", icon: FileText },
  { id: "precautions", label: "Safety Precautions", icon: Shield },
  { id: "authority", label: "Authority to Proceed", icon: CheckCircle2 },
];

interface Props {
  onSubmit: (data: PermitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PermitForm({ onSubmit, onCancel, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState<PermitTab>("details");

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PermitFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: "", submitter: "", manager: "", location: "",
      workType: "Cold Work", workDescription: "",
      spq1: "no", spq2: "no", spq3: "no", spq4: "no", spq5: "no",
      authorityName: "", status: "draft",
    },
  });

  const status = watch("status");

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex flex-col md:flex-row h-full md:min-h-[540px] border border-border rounded-lg overflow-hidden bg-card">
      {/* Mobile: horizontal tab bar */}
      <div className="flex md:hidden items-center gap-1 px-4 py-3 border-b border-border bg-muted overflow-x-auto">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                isActive ? "bg-primary-foreground text-primary" : "border-2 border-muted-foreground/20 text-muted-foreground/40"
              )}>
                {idx + 1}
              </span>
              {isActive && <span>{tab.label}</span>}
            </button>
          );
        })}
        <button type="button" onClick={onCancel} className="ml-auto text-xs text-muted-foreground/50 hover:text-destructive whitespace-nowrap px-2">
          &times; Exit
        </button>
      </div>

      {/* Desktop: left sidebar */}
      <div className="hidden md:flex w-56 shrink-0 bg-slate-800 text-white flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-sm">Permit to Work</span>
          </div>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide", statusColors[status])}>
            {status}
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-2">Tabs</p>
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                )}
              >
                <span className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0",
                  isActive ? "border-green-400 bg-green-400 text-slate-900" : "border-slate-600 text-slate-500"
                )}>
                  {idx + 1}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button type="button" onClick={onCancel} className="w-full text-xs text-slate-500 hover:text-slate-300 text-left px-2 py-1 transition-colors">
            ✕ Exit Record
          </button>
        </div>
      </div>

      {/* Main content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-muted/30">
          <h2 className="text-base font-semibold">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel} className="hidden sm:inline-flex">Exit Record</Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Tab 1: Permit Details */}
          {activeTab === "details" && (
            <div className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Work Type</Label>
                  <Controller name="workType" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Hot Work", "Cold Work", "Electrical", "Working at Height", "Confined Space", "Mechanical"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-1">
                  <Label>Submitter</Label>
                  <Input {...register("submitter")} placeholder="Full name" />
                  {errors.submitter && <p className="text-xs text-destructive">{errors.submitter.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Manager</Label>
                  <Input {...register("manager")} placeholder="Full name" />
                  {errors.manager && <p className="text-xs text-destructive">{errors.manager.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label>Location</Label>
                  <Input {...register("location")} placeholder="e.g. Building 3 – Fab Bay 7" />
                  {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label>Description of Work</Label>
                  <Textarea {...register("workDescription")} placeholder="Describe the work to be carried out..." rows={3} />
                  {errors.workDescription && <p className="text-xs text-destructive">{errors.workDescription.message}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("precautions")}>Next: Safety Precautions →</Button>
              </div>
            </div>
          )}

          {/* Tab 2: Safety Precautions */}
          {activeTab === "precautions" && (
            <div className="space-y-5 max-w-2xl">
              <p className="text-sm text-muted-foreground">Confirm each safety precaution has been addressed before proceeding.</p>
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                {SAFETY_QUESTIONS.map(({ key, text }) => (
                  <Controller key={key} name={key} control={control} render={({ field }) => (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-4 bg-card hover:bg-muted/30 transition-colors">
                      <p className="text-sm pr-4">{text}</p>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => field.onChange("yes")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                            field.value === "yes"
                              ? "bg-green-100 border-green-300 text-green-800"
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("no")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                            field.value === "no"
                              ? "bg-red-50 border-red-300 text-red-700"
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <XCircle className="h-3.5 w-3.5" /> No
                        </button>
                      </div>
                    </div>
                  )} />
                ))}
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>← Back</Button>
                <Button type="button" onClick={() => setActiveTab("authority")}>Next: Authority to Proceed →</Button>
              </div>
            </div>
          )}

          {/* Tab 3: Authority to Proceed */}
          {activeTab === "authority" && (
            <div className="space-y-5 max-w-2xl">
              <p className="text-sm text-muted-foreground">Complete authority sign-off before issuing this permit.</p>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Authorised By</Label>
                  <Input {...register("authorityName")} placeholder="Name of person authorising" />
                </div>
                <div className="space-y-1">
                  <Label>Permit Status</Label>
                  <Controller name="status" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved / Issued</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("precautions")}>← Back</Button>
                <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                  {isLoading ? "Saving..." : "Issue Permit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
