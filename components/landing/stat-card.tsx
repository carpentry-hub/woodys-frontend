'use client';

import React from 'react';
import { LucideProps } from 'lucide-react';

interface StatCardProps {
  icon: React.ComponentType<LucideProps>;
  value: string;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({ icon: IconComponent, value, label, iconBgColor, iconColor }: StatCardProps) {
    return (
        <div className="text-center bg-white rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: iconBgColor }}
            >
                <IconComponent className="w-7 h-7" style={{ color: iconColor }} />
            </div>
            <div className="text-3xl font-bold text-[#3b3535] mb-1">{value}</div>
            <div className="text-base text-[#676765]">{label}</div>
        </div>
    );
}