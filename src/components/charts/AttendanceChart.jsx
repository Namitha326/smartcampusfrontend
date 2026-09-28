import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AttendanceChart = ({ data, height = 240 }) => {
  const chartData = data || [
    { week: "W1", attendance: 95 },
    { week: "W2", attendance: 90 },
    { week: "W3", attendance: 85 },
    { week: "W4", attendance: 88 },
    { week: "W5", attendance: 92 },
    { week: "W6", attendance: 86 },
    { week: "W7", attendance: 89 },
    { week: "W8", attendance: 88.5 },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Attendance']}
          />
          <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#attendanceGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
