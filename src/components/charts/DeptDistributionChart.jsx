import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const DeptDistributionChart = ({ data, height = 260 }) => {
  const chartData = data || [
    { name: "CSE", value: 1120, color: "#4f46e5" },
    { name: "IT", value: 780, color: "#06b6d4" },
    { name: "ECE", value: 640, color: "#10b981" },
    { name: "MECH", value: 510, color: "#f59e0b" },
    { name: "CIVIL", value: 370, color: "#8b5cf6" },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || entry.fill || '#4f46e5'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            formatter={(value, name) => [`${value} Students`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeptDistributionChart;
