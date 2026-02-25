import React from 'react';

interface HazardCardProps {
    title: string;
    riskLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
    riskScore?: number;
    severity?: number;
    likelihood?: number;
    tags?: string[];
    mitigationPlan: string;
    className?: string;
}

export default function HazardCard({
    title,
    riskLevel,
    riskScore,
    severity,
    likelihood,
    tags = [],
    mitigationPlan,
    className = ''
}: HazardCardProps) {
    const riskColor = riskLevel === 'HIGH RISK' ? 'text-red-700' : riskLevel === 'MEDIUM RISK' ? 'text-amber-700' : 'text-green-700';

    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
            <div className="p-5 pb-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className={`${riskColor} font-bold text-sm tracking-wide`}>{riskLevel}</span>
                        {riskScore && (
                            <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-sm border border-gray-200">
                                {riskScore}
                            </span>
                        )}
                        <span className="font-bold text-gray-900 ml-1">{title}</span>
                    </div>
                    {(severity !== undefined && likelihood !== undefined) && (
                        <div className="text-gray-400 text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            S:{severity} L:{likelihood}
                        </div>
                    )}
                </div>
                {tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {tags.map((tag, index) => (
                            <span key={index} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-medium border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-200">
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">MITIGATION PLAN</p>
                <p className="text-gray-800 text-sm">{mitigationPlan}</p>
            </div>
        </div>
    );
}
