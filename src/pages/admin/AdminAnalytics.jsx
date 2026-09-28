import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import DeptDistributionChart from '../../components/charts/DeptDistributionChart';
import AdminTrendChart from '../../components/charts/AdminTrendChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart3, TrendingUp, Users, Award, BookOpen, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Aggregating university institutional analytics..." />;

  const placementData = [
    { department: 'CSE', placed: 94, higherEd: 6 },
    { department: 'IT', placed: 91, higherEd: 8 },
    { department: 'ECE', placed: 84, higherEd: 12 },
    { department: 'MECH', placed: 78, higherEd: 15 },
    { department: 'CIVIL', placed: 72, higherEd: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Analytics & Intelligence</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Longitudinal campus trends, department-wise retention, academic distribution, and placement outcomes.
        </p>
      </div>

      {/* Top Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value="87.8%"
          subtitle="Top recruiters: Microsoft, Amazon, TCS"
          trend="+5.2% vs 2025"
          trendDirection="up"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Student Retention Rate"
          value="98.4%"
          subtitle="First-to-second year persistence"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Campus Research Grants"
          value="$1.42M"
          subtitle="Funded across 18 laboratory patents"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Grievance Resolution Avg"
          value="1.8 Days"
          subtitle="Down from 3.5 days target"
          trend="-45% response time"
          trendDirection="up"
          icon={AlertCircle}
          color="sky"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Department Student Capacity Distribution"
          subtitle="Total headcounts across the 5 degree divisions"
        >
          <DeptDistributionChart data={analytics?.deptStudents} height={270} />
        </Card>

        <Card
          title="Longitudinal Attendance Stability"
          subtitle="Mean campus monthly attendance percentages"
        >
          <AdminTrendChart data={analytics?.attendanceTrends} height={270} />
        </Card>
      </div>

      {/* Placement & Higher Education Outcomes by Department */}
      <Card
        title="Department Placement & Higher Studies Metrics (% of Cohort)"
        subtitle="Final year career destinations across engineering divisions"
      >
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={placementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(v) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="placed" name="Corporate Placements" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="higherEd" name="Higher Education / Masters" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
