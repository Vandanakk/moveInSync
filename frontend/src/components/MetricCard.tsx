import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositive?: boolean;
  };
  badge?: {
    text: string;
    variant: 'blue' | 'amber' | 'rose' | 'emerald' | 'slate';
  };
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badge,
  highlight,
}) => {
  const badgeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-sm ${
        highlight ? 'border-blue-400 ring-1 ring-blue-100 shadow-sm' : 'border-slate-200/90'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeStyles[badge.variant]
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`text-[11px] font-medium ${
                trend.isPositive === undefined
                  ? 'text-slate-500'
                  : trend.isPositive
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
