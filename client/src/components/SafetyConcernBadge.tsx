import React from 'react';
import { cn } from '@/lib/utils';

interface SafetyConcernBadgeProps {
    text: string;
    icon: React.ReactNode;
    className?: string;
}

export default function SafetyConcernBadge({ text, icon, className }: SafetyConcernBadgeProps) {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 text-cyan-800 font-medium text-sm shadow-sm bg-cyan-50",
            className
        )}>
            <div className="w-6 h-6 rounded-full bg-[#288498] text-white flex items-center justify-center shrink-0">
                {icon}
            </div>
            {text}
        </div>
    );
}