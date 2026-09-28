import React from 'react';

const statusColorMap = {
  // Positive / Success
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  graded: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',

  // Pending / In-progress / Warning
  pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
  'under review': 'bg-amber-50 text-amber-700 border-amber-200/60',
  'in progress': 'bg-sky-50 text-sky-700 border-sky-200/60',
  submitted: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  medium: 'bg-amber-50 text-amber-700 border-amber-200/60',

  // Negative / Danger
  rejected: 'bg-rose-50 text-rose-700 border-rose-200/60',
  absent: 'bg-rose-50 text-rose-700 border-rose-200/60',
  late: 'bg-rose-50 text-rose-700 border-rose-200/60',
  high: 'bg-rose-50 text-rose-700 border-rose-200/60',
  critical: 'bg-rose-50 text-rose-700 border-rose-200/60',

  // Info / Categories
  technical: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  workshop: 'bg-purple-50 text-purple-700 border-purple-200/60',
  cultural: 'bg-pink-50 text-pink-700 border-pink-200/60',
  sports: 'bg-teal-50 text-teal-700 border-teal-200/60',
  academic: 'bg-blue-50 text-blue-700 border-blue-200/60',
  exam: 'bg-orange-50 text-orange-700 border-orange-200/60',
  important: 'bg-rose-50 text-rose-700 border-rose-200/60',
  general: 'bg-slate-100 text-slate-700 border-slate-200/60',
  low: 'bg-slate-100 text-slate-600 border-slate-200/60',
  reported: 'bg-amber-50 text-amber-700 border-amber-200/60',
  claimed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
};

export const Badge = ({
  children,
  variant,
  className = '',
  dot = false,
  size = 'md',
}) => {
  const normalizedKey = (variant || children || '').toString().toLowerCase().trim();
  const colorClass = statusColorMap[normalizedKey] || 'bg-slate-100 text-slate-700 border-slate-200';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClass} ${sizeClass} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      )}
      {children}
    </span>
  );
};

export default Badge;
