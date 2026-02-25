import React from 'react';
import { NameAvatar } from '@/components/ui/name-avatar';

interface SignOffCardProps {
    title?: string;
    description?: string;
    isSigned?: boolean;
    signedBy?: string;
    signedDate?: string;
    className?: string;
}

export default function SignOffCard({
    title = "SIGN OFF",
    description,
    isSigned = false,
    signedBy,
    signedDate,
    className = ''
}: SignOffCardProps) {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
            <div className="p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
                {signedBy && signedBy !== "Pending" && (
                    <div className="flex items-center gap-2.5 mb-3">
                        <NameAvatar name={signedBy} className="h-8 w-8 text-[11px]" />
                        <p className="text-sm font-semibold text-slate-800">{signedBy}</p>
                    </div>
                )}
                {isSigned ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <p className="text-emerald-800 text-sm font-semibold">Signed</p>
                            {signedDate && <p className="text-emerald-600 text-xs mt-0.5">{signedDate}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><circle cx="12" cy="12" r="1" /><path strokeLinecap="round" d="M12 6v4" /></svg>
                        </div>
                        <p className="text-amber-800 text-sm font-medium">Awaiting signature</p>
                    </div>
                )}
            </div>
        </div>
    );
}
