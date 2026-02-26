import React from 'react';
import { AlertTriangle, Users, History, ClipboardCheck, FileText, ChevronDown, ExternalLink, ShieldCheck, ShieldAlert, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NameAvatar } from '@/components/ui/name-avatar';
import { cn } from '@/lib/utils';

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

/* ── tiny reusable: teal section header ── */
function SectionHeader({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#1e5e3f] rounded-t-lg">
            <span className="text-white [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:stroke-[2.5]">{icon}</span>
            <h2 className="text-[13px] font-bold text-white m-0">{children}</h2>
        </div>
    );
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

    const riskBadge = (level: Hazard['riskLevel']) => {
        if (level === 'HIGH RISK') return 'bg-red-50 text-red-800 border-red-200';
        if (level === 'MEDIUM RISK') return 'bg-amber-50 text-amber-800 border-amber-200';
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    };

    const riskBorder = (level: Hazard['riskLevel']) => {
        if (level === 'HIGH RISK') return 'border-l-red-400';
        if (level === 'MEDIUM RISK') return 'border-l-orange-400';
        return 'border-l-emerald-400';
    };

    return (
        <div className="flex flex-col gap-2.5 font-display py-4">

            {/* ═══════════ PAGE HEADER ═══════════ */}
            <div className="flex items-center gap-6 pb-4 border-b-2 border-slate-200 px-4 pt-4">
                {/* ASML Logo */}
                <svg className="w-[100px] h-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1065 300" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0,-752.36216)"><g transform="translate(-353.3275,478.58303)"><g>
                        <polygon points="1065.83,566.929 1102.68,388.346 1116.71,566.929 1196.223,566.929 1159.373,283.464 1074.333,283.464 1034.646,453.542 994.964,283.464 909.924,283.464 873.072,566.929 952.443,566.929 966.617,388.346 1003.468,566.929" style={{fill:'#0f238c'}}/>
                        <polygon points="1312.442,283.464 1235.907,283.464 1235.907,566.929 1417.324,566.929 1417.324,507.401 1312.442,507.401" style={{fill:'#0f238c'}}/>
                        <path d="m 535.749,283.464 -96.379,0 -85.039,283.465 85.04,0 11.338,-51.023 73.701,0 11.339,51.023 85.04,0 -85.04,-283.465 z m -48.189,62.362 25.512,116.22 -51.024,0.001 25.512,-116.221 z" style={{fill:'#0f238c'}}/>
                        <path d="m 824.881,362.835 c -70.432,-61.604 -180.339,-36.558 -181.417,19.843 -15.981,-104.645 110.563,-126.492 181.41,-93.544 1.262,16.802 2.527,34.892 0.007,73.701 z" style={{fill:'#0f238c'}}/>
                        <path d="m 766.445,396.213 c -17.745,-6.926 -43.562,-13.227 -43.599,-33.403 -0.015,-8.241 3.375,-17.189 19.83,-22.651 -56.693,5.669 -75.599,74.633 -12.896,108.91 10.928,5.974 29.904,12.311 29.904,32.82 0,23.957 -26.32,32.617 -43.634,32.251 -28.761,-0.605 -51.885,-10.652 -78.256,-29.417 l 0,68.032 c 31.207,13.434 82.039,28.928 132.996,13.256 41.183,-12.666 76.768,-47.236 76.768,-84.123 0.002,-60.022 -52.091,-74.346 -81.113,-85.675 z" style={{fill:'#0f238c'}}/>
                    </g></g></g>
                </svg>
                <div className="flex flex-col gap-px flex-1">
                    <span className="text-[10px] font-bold text-[#1e5e3f] tracking-[1px] uppercase flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> EHS IRELAND
                    </span>
                    <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none m-0">
                        Integrated Safety Plan (ISP)
                    </h1>
                </div>
            </div>

            {/* ═══════════ DOCUMENT TITLE + META ═══════════ */}
            <div className="px-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[28px] font-extrabold text-slate-900 leading-snug pb-3 border-b-[3px] border-[#0f766e] tracking-tight">
                            {title}
                        </h2>
                        <p className="text-[13px] font-semibold text-slate-500 mt-2">
                            {location} &bull; {machine} &bull; {system || '—'} &bull; {shift} Shift
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        {planId && (
                            <div className="text-[28px] font-bold text-[#0f766e] leading-none font-mono tracking-wide">
                                ISP-{String(planId).padStart(4, '0')}
                            </div>
                        )}
                        <div className="text-[13px] text-slate-500 font-medium mt-1">{date}</div>
                    </div>
                </div>

                {/* Status pill */}
                <div className="mt-2 mb-1">
                    <span className={cn(
                        "inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded",
                        status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-900 text-white'
                    )}>
                        {status === 'Active' ? 'Approved' : status === 'Completed' ? 'Completed' : 'Pending'}
                    </span>
                </div>

                <div className="h-px bg-slate-200 my-2" />

                {/* ── Status info boxes ── */}
                <div className="grid grid-cols-4 gap-1 mb-3">
                    {[
                        { label: 'Risk Level', value: hazards.some(h => h.riskLevel === 'HIGH RISK') ? 'High' : hazards.some(h => h.riskLevel === 'MEDIUM RISK') ? 'Medium' : 'Low', highlight: hazards.some(h => h.riskLevel === 'HIGH RISK') },
                        { label: 'System', value: system || '—' },
                        { label: 'Group', value: group },
                        { label: 'Valid For', value: 'EoS' },
                    ].map((box) => (
                        <div
                            key={box.label}
                            className="bg-[#1e5e3f]/[0.08] border-2 border-[#1e5e3f] rounded px-2 py-1.5"
                        >
                            <div className="text-[10px] font-semibold text-slate-500 mb-px">{box.label}</div>
                            <div className={cn("text-[11px] font-bold text-slate-900", box.highlight && "text-red-600")}>
                                {box.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════ WORK DETAILS & TEAM (combined card) ═══════════ */}
            <div className="mx-4 rounded-lg border-2 border-slate-200 overflow-hidden bg-white/50">
                <SectionHeader icon={<FileText />}>Work Details &amp; Team</SectionHeader>

                {/* Details grid */}
                <div className="px-4 py-3 border-b border-slate-200">
                    <div className="grid grid-cols-6 gap-1.5">
                        {[
                            { label: 'Location', value: location },
                            { label: 'Machine', value: machine },
                            { label: 'Shift', value: shift },
                            { label: 'Group', value: group },
                            { label: 'System', value: system || '—' },
                            { label: 'Date', value: date },
                        ].map(d => (
                            <div key={d.label}>
                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-px">{d.label}</div>
                                <div className="text-[13px] font-bold text-slate-900">{d.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="px-4 py-3">
                    <div className="grid grid-cols-[auto_1fr] gap-5">
                        {/* Lead */}
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Action Lead</div>
                            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white/50 rounded px-2 py-1.5">
                                <NameAvatar name={signOffs[0]?.name || '—'} className="h-5 w-5 text-[9px]" />
                                <span className="text-sm font-bold text-slate-900">{signOffs[0]?.name || '—'}</span>
                            </div>
                        </div>
                        {/* Members */}
                        <div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Members</div>
                            <div className="grid grid-cols-3 gap-2">
                                {engineers.slice(0, 6).map(name => (
                                    <div key={name} className="inline-flex items-center gap-2 border border-slate-200 bg-white/50 rounded px-2 py-1.5 min-w-0">
                                        <NameAvatar name={name} className="h-5 w-5 text-[9px] shrink-0" />
                                        <span className="text-[11px] font-medium text-slate-900 truncate">{name}</span>
                                    </div>
                                ))}
                                {engineers.length > 6 && (
                                    <span className="text-xs text-slate-500 font-semibold self-center">+{engineers.length - 6} more</span>
                                )}
                                {engineers.length === 0 && <span className="text-xs text-slate-400">No team members</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ SAFETY REQUIREMENTS + RISK ASSESSMENT (side by side) ═══════════ */}
            <div className="mx-4 grid grid-cols-1 md:grid-cols-2 gap-2 print-row-2col">

                {/* Safety Requirements */}
                <div className="rounded-lg border-2 border-slate-200 overflow-hidden bg-white/50">
                    <SectionHeader icon={<CheckCircle2 />}>Safety Requirements</SectionHeader>
                    <div className="p-3">
                        {safetyConcerns.length === 0 ? (
                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold py-2">
                                <ShieldCheck className="h-4 w-4" /> All safety checks cleared
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                {safetyConcerns.map(concern => (
                                    <button
                                        key={concern.id}
                                        type="button"
                                        onClick={() => onConcernClick?.(concern.id)}
                                        className="flex items-center gap-2 bg-white/50 border border-slate-200 border-l-2 border-l-slate-300 rounded px-3 py-2.5 hover:border-l-[#0f766e] hover:shadow-sm transition-all text-left"
                                    >
                                        <div className="w-5 h-5 rounded bg-[#0f766e] text-white flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{concern.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {clearedCount > 0 && (
                            <p className="text-[10px] text-slate-400 mt-2">{clearedCount} item{clearedCount !== 1 ? 's' : ''} cleared</p>
                        )}
                    </div>
                </div>

                {/* Risk Assessment / Hazards */}
                <div className="rounded-lg border-2 border-slate-200 overflow-hidden bg-white/50">
                    <SectionHeader icon={<AlertTriangle />}>Risk Assessment</SectionHeader>
                    <div className="p-3">
                        {hazards.length === 0 ? (
                            <p className="text-sm text-slate-500 py-2">No hazards identified.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {hazards.map(hazard => (
                                    <div
                                        key={hazard.id}
                                        className={cn(
                                            "bg-white/50 border-2 border-slate-200 rounded p-2.5 border-l-2",
                                            riskBorder(hazard.riskLevel)
                                        )}
                                    >
                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div>
                                                <span className="text-[13px] font-extrabold text-slate-900">{hazard.title}</span>
                                                <span className={cn(
                                                    "ml-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                                                    riskBadge(hazard.riskLevel)
                                                )}>
                                                    {hazard.riskLevel === 'HIGH RISK' ? 'High' : hazard.riskLevel === 'MEDIUM RISK' ? 'Medium' : 'Low'}
                                                </span>
                                            </div>
                                            {(hazard.severity !== undefined && hazard.likelihood !== undefined) && (
                                                <div className="flex gap-2 text-[11px] shrink-0">
                                                    <div className="text-center">
                                                        <div className="text-slate-500 font-bold">Sev</div>
                                                        <div className="font-bold text-red-600">{hazard.severity}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-slate-500 font-bold">Lik</div>
                                                        <div className="font-bold text-orange-600">{hazard.likelihood}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Mitigation */}
                                        <div className="bg-amber-50 rounded px-2 py-1.5">
                                            <div className="text-[11px] text-slate-500 font-extrabold uppercase mb-0.5">Mitigation:</div>
                                            <p className="text-[13px] font-bold text-slate-900 m-0 leading-snug">{hazard.mitigationPlan}</p>
                                        </div>
                                        {/* Tags */}
                                        {hazard.tags && hazard.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {hazard.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════ REQUIRED DOCUMENTS ═══════════ */}
            {(checklistHazards.length > 0 || ptwHazards.length > 0) && (
                <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 gap-2 print-row-2col">
                    {checklistHazards.length > 0 && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <ClipboardCheck className="h-4 w-4 text-blue-600" />
                                <p className="text-xs font-bold text-blue-800">Required Checklists</p>
                            </div>
                            <div className="space-y-1">
                                {checklistHazards.map(ref => (
                                    <p key={ref.name} className="text-[11px] text-blue-700 font-medium">
                                        {ref.type} — {ref.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                    {ptwHazards.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-amber-600" />
                                <p className="text-xs font-bold text-amber-800">Linked Permit to Work (PtW)</p>
                            </div>
                            <div className="space-y-1">
                                {ptwHazards.map(ref => (
                                    <p key={ref.name} className="text-[11px] text-amber-700 font-medium">
                                        {ref.type} — {ref.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════ AUTHORIZATIONS & SIGN-OFF ═══════════ */}
            <div className="mx-4 rounded-lg border-2 border-slate-200 overflow-hidden">
                <SectionHeader icon={<CheckCircle2 />}>Authorizations &amp; Sign-Off</SectionHeader>
                <div className="px-4 py-3">
                    <table className="w-full text-[13px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider pb-2 w-24">Role</th>
                                <th className="text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider pb-2">Name</th>
                                <th className="text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider pb-2 w-28">Date</th>
                                <th className="text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider pb-2 w-24">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signOffs.map((signOff) => {
                                const hasName = signOff.name && signOff.name !== "Pending";
                                const isSigned = !!signOff.date;
                                return (
                                    <tr key={signOff.id} className="border-b border-slate-100 last:border-b-0">
                                        <td className="py-2.5 font-bold text-slate-900">{signOff.role}</td>
                                        <td className="py-2.5 font-semibold text-slate-700">{hasName ? signOff.name : '—'}</td>
                                        <td className="py-2.5 font-medium text-slate-600">{signOff.date || '—'}</td>
                                        <td className="py-2.5">
                                            {isSigned ? (
                                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Approved</span>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {comments && (
                        <p className="text-[12px] text-slate-500 italic border-t border-slate-100 pt-2 mt-2">"{comments}"</p>
                    )}
                </div>
            </div>

            {/* ═══════════ NOTICE ═══════════ */}
            <div className="mx-4 bg-emerald-50/50 border border-slate-200 border-l-2 border-l-slate-300 rounded p-3 text-sm text-slate-900 leading-relaxed">
                <strong className="text-[#0f766e]">Important:</strong> This safety plan must be reviewed and signed before work begins. It is valid for 30 days from approval. Notify your safety manager immediately if conditions change.
            </div>

            {/* ═══════════ VERSION HISTORY ═══════════ */}
            {planId && (
                <div className="mx-4 rounded-lg border-2 border-slate-200 bg-white/50 p-3">
                    <button
                        type="button"
                        onClick={onToggleVersion}
                        className="w-full flex items-center gap-2 py-1 text-left group"
                    >
                        <History className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Version History</span>
                        <Badge variant="secondary" className="ml-1 text-[10px] px-2 py-0.5">
                            v{Math.max(1, auditLogs.filter((l: any) => l.action === "edited").length + 1)}.0
                        </Badge>
                        <ChevronDown className={cn(
                            "h-3.5 w-3.5 ml-auto text-slate-400 transition-transform duration-200",
                            versionOpen && "rotate-180"
                        )} />
                    </button>

                    {versionOpen && (
                        <div className="pt-3">
                            {auditLogs.length === 0 ? (
                                <p className="text-xs text-slate-500">No audit trail available.</p>
                            ) : (
                                <div className="relative pl-5 space-y-3">
                                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                                    {auditLogs.map((log: any, idx: number) => {
                                        const isLatest = idx === 0;
                                        const actionColors: Record<string, string> = {
                                            created: "bg-[#1e5e3f]",
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
                                                                className="inline-flex items-center gap-1 mt-1 text-xs text-[#0f766e] hover:underline cursor-pointer"
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

            {/* ═══════════ FOOTER ═══════════ */}
            <div className="mx-4 bg-white/50 border-t border-slate-200 rounded py-2.5 px-3 text-center text-[11px] text-slate-500">
                Safety Plan {planId ? `ISP-${String(planId).padStart(4, '0')}` : ''} &bull; Contact your safety manager with any questions
            </div>
        </div>
    );
}
