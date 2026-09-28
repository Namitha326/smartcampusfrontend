import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminTrendChart = ({ data, height = 240 }) => {
  const chartData = data || [
    { month: "Jan", attendance: 89.2 },
    { month: "Feb", attendance: 87.5 },
    { month: "Mar", attendance: 84.1 },
    { month: "Apr", attendance: 86.8 },
    { month: "May", attendance: 91.0 },
    { month: "Jun", attendance: 85.4 },
    { month: "Jul", attendance: 88.0 },
    { month: "Aug", attendance: 86.2 },
    { month: "Sep", attendance: 85.4 },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[75, 95]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Campus Attendance']}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminTrendChart;
