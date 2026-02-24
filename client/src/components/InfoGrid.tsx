import React from 'react';

interface InfoItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

interface InfoGridProps {
    items: InfoItem[];
    className?: string;
}

export default function InfoGrid({ items, className }: InfoGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        {item.icon && (
                            <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.label}</p>
                            <p className="text-lg font-bold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}