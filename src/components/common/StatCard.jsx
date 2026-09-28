import React from 'react';

const colorThemes = {
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    trendUp: 'text-indigo-600 bg-indigo-50',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    trendUp: 'text-emerald-700 bg-emerald-50',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    trendUp: 'text-amber-700 bg-amber-50',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
    trendUp: 'text-rose-700 bg-rose-50',
  },
  sky: {
    iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
    trendUp: 'text-sky-700 bg-sky-50',
  },
  purple: {
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    trendUp: 'text-purple-700 bg-purple-50',
  },
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
  trendDirection = 'up',
  className = '',
  onClick,
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-card hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${theme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-medium ${
                trendDirection === 'up'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              }`}
            >
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
