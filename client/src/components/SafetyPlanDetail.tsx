import React from 'react';
import { AlertTriangle, Users, History, ClipboardCheck, FileText, ChevronDown, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NameAvatar } from '@/components/ui/name-avatar';
import { cn } from '@/lib/utils';
import SafetyConcernBadge from './SafetyConcernBadge';
import HazardCard from './HazardCard';
import SignOffCard from './SignOffCard';

interface SafetyConcern {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
    definition?: string;
}

interface Hazard {
    id: string;
    title: string;
    riskLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
    riskScore?: number;
    severity?: number;
    likelihood?: number;
    tags?: string[];
    mitigationPlan: string;
}

interface SignOff {
    id: string;
    role: string;
    description?: string;
    name: string;
    date?: string;
}

interface DocumentRef {
    name: string;
    type: string;
}

interface SafetyPlanDetailProps {
    title: string;
    status: 'Active' | 'Draft' | 'Completed';
    date: string;
    shift: string;
    location: string;
    machine: string;
    group: string;
    system?: string;
    safetyConcerns: SafetyConcern[];
    clearedCount?: number;
    onConcernClick?: (id: string) => void;
    hazards: Hazard[];
    checklistHazards?: DocumentRef[];
    ptwHazards?: DocumentRef[];
    signOffs: SignOff[];
    engineers?: string[];
    comments?: string;
    planId?: number;
    auditLogs?: any[];
    versionOpen?: boolean;
    onToggleVersion?: () => void;
    onViewReusedPlan?: (planId: number) => void;
}

function formatTimestamp(ts: string | null) {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SafetyPlanDetail({
    title,
    status,
    date,
    shift,
    location,
    machine,
    group,
    system,
    safetyConcerns,
    clearedCount = 0,
    onConcernClick,
    hazards,
    checklistHazards = [],
    ptwHazards = [],
    signOffs,
    engineers = [],
    comments,
    planId,
    auditLogs = [],
    versionOpen = false,
    onToggleVersion,
    onViewReusedPlan,
}: SafetyPlanDetailProps) {
    const infoItems = [
        { label: 'Shift', value: shift },
        { label: 'Location', value: location },
        { label: 'Machine', value: machine },
        { label: 'Group', value: group },
        ...(system ? [{ label: 'System', value: system }] : []),
    ];

    return (
        <div className="divide-y divide-slate-100">
            {/* Summary Grid */}
            <div className="px-6 lg:px-10 py-6">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {infoItems.map((item) => (
                        <div key={item.label}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Concerns */}
            <div className="px-6 lg:px-10 py-6">
                {safetyConcerns.length > 0 ? (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-4.5 h-4.5 text-amber-600" />
                            <p className="text-sm font-semibold text-amber-800">
                                {safetyConcerns.length} Safety Concern{safetyConcerns.length !== 1 ? "s" : ""} Flagged
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {safetyConcerns.map((concern) => (
                                <button
                                    key={concern.id}
                                    type="button"
                                    onClick={() => onConcernClick?.(concern.id)}
                                    className="cursor-pointer transition-transform hover:scale-[1.03]"
                                >
                                    <SafetyConcernBadge
                                        text={concern.title}
                                        icon={concern.icon}
                                    />
                                </button>
                            ))}
                        </div>
                        {clearedCount > 0 && (
                            <div className="flex items-center gap-1.5 pt-3">
                                <ShieldCheck className="h-3 w-3 text-brand" />
                                <p className="text-[11px] text-slate-500">{clearedCount} item{clearedCount !== 1 ? "s" : ""} cleared</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand" />
                        <p className="text-sm font-semibold text-brand">All Safety Checks Cleared</p>
                    </div>
                )}
            </div>

            {/* Hazards */}
            <div className="px-6 lg:px-10 py-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h2 className="text-sm font-semibold text-slate-800">Hazards ({hazards.length})</h2>
                </div>
                {hazards.length === 0 ? (
                    <p className="text-sm text-slate-500">No hazards identified.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hazards.map((hazard) => (
                            <HazardCard
                                key={hazard.id}
                                title={hazard.title}
                                riskLevel={hazard.riskLevel}
                                riskScore={hazard.riskScore}
                                severity={hazard.severity}
                                likelihood={hazard.likelihood}
                                tags={hazard.tags}
                                mitigationPlan={hazard.mitigationPlan}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Required Documents */}
            {(checklistHazards.length > 0 || ptwHazards.length > 0) && (
                <div className="px-6 lg:px-10 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {checklistHazards.length > 0 && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ClipboardCheck className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-semibold text-blue-800">Required Checklists</p>
                                </div>
                                <div className="space-y-1">
                                    {checklistHazards.map(ref => (
                                        <p key={ref.name} className="text-[11px] text-blue-700">
                                            {ref.type} — {ref.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {ptwHazards.length > 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-amber-600" />
                                    <p className="text-xs font-semibold text-amber-800">Linked Permit to Work</p>
                                </div>
                                <div className="space-y-1">
                                    {ptwHazards.map(ref => (
                                        <p key={ref.name} className="text-[11px] text-amber-700">
                                            {ref.type} — {ref.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Sign Off */}
            <div className="px-6 lg:px-10 py-3">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <h2 className="text-xs font-semibold text-slate-800">Sign Off</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {signOffs.map((signOff) => (
                        <SignOffCard
                            key={signOff.id}
                            title={signOff.role}
                            description={signOff.description}
                            isSigned={!!signOff.date}
                            signedBy={signOff.name}
                            signedDate={signOff.date}
                        />
                    ))}
                    {/* Team column */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-3">
                        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Team</h3>
                        {engineers.length > 0 ? (
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    {engineers.slice(0, 4).map(name => (
                                        <NameAvatar key={name} name={name} className="h-6 w-6 text-[9px] ring-1.5 ring-white" />
                                    ))}
                                </div>
                                {engineers.length > 4 && (
                                    <span className="text-[10px] text-slate-500 font-medium">+{engineers.length - 4}</span>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No team members</p>
                        )}
                    </div>
                </div>
                {comments && (
                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 italic">"{comments}"</p>
                )}
            </div>

            {/* Version History */}
            {planId && (
                <div className="px-6 lg:px-10">
                    <button
                        type="button"
                        onClick={onToggleVersion}
                        className="w-full flex items-center gap-2 py-4 text-left group"
                    >
                        <History className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Version History</span>
                        <Badge variant="secondary" className="ml-1 text-[9px] px-1.5 py-0">
                            v{Math.max(1, auditLogs.filter((l: any) => l.action === "edited").length + 1)}.0
                        </Badge>
                        <ChevronDown className={cn(
                            "h-3.5 w-3.5 ml-auto text-slate-400 transition-transform duration-200",
                            versionOpen && "rotate-180"
                        )} />
                    </button>

                    {versionOpen && (
                        <div className="pb-5">
                            {auditLogs.length === 0 ? (
                                <p className="text-xs text-slate-500">No audit trail available.</p>
                            ) : (
                                <div className="relative pl-5 space-y-3">
                                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                                    {auditLogs.map((log: any, idx: number) => {
                                        const isLatest = idx === 0;
                                        const actionColors: Record<string, string> = {
                                            created: "bg-brand",
                                            edited: "bg-amber-500",
                                            approved: "bg-blue-500",
                                            rejected: "bg-red-500",
                                            reused: "bg-teal-500",
                                        };
                                        const reusedPlanId = log.action === "reused" && log.changes?.reusedAsId
                                            ? log.changes.reusedAsId
                                            : null;
                                        return (
                                            <div key={log.id} className="relative">
                                                <div className={cn(
                                                    "absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                                                    actionColors[log.action] || "bg-slate-400"
                                                )} />
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium capitalize">{log.action}</span>
                                                            {isLatest && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Latest</Badge>}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            by {log.performedBy}
                                                            {log.previousStatus && log.newStatus && log.previousStatus !== log.newStatus && (
                                                                <span> &middot; {log.previousStatus} &rarr; {log.newStatus}</span>
                                                            )}
                                                        </p>
                                                        {log.comments && (
                                                            <p className="text-xs text-slate-500 mt-1 italic">"{log.comments}"</p>
                                                        )}
                                                        {reusedPlanId && (
                                                            <button
                                                                type="button"
                                                                onClick={() => onViewReusedPlan?.(reusedPlanId)}
                                                                className="inline-flex items-center gap-1 mt-1 text-xs text-brand hover:underline cursor-pointer"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                                View new entry (ISP-{String(reusedPlanId).padStart(4, "0")})
                                                            </button>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                                                        {formatTimestamp(log.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}