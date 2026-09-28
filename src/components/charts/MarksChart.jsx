import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const MarksChart = ({ data, height = 260 }) => {
  const chartData = data || [
    { subject: 'Java', student: 90, classAvg: 76 },
    { subject: 'DSA', student: 86, classAvg: 72 },
    { subject: 'DBMS', student: 80, classAvg: 74 },
    { subject: 'Networks', student: 78, classAvg: 71 },
    { subject: 'Web Dev', student: 95, classAvg: 82 },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="subject" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="student" name="My Marks" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="classAvg" name="Class Average" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarksChart;
