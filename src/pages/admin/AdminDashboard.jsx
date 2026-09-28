import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DeptDistributionChart from '../../components/charts/DeptDistributionChart';
import AdminTrendChart from '../../components/charts/AdminTrendChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  GraduationCap,
  Users,
  Building2,
  Clock,
  Award,
  AlertCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(),
        ]);
        setStats(statsRes);
        setAnalytics(analyticsRes);
      } catch (err) {
        console.error('Error loading admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner text="Connecting to university institutional database..." />;

  const complaintData = analytics?.complaintsByCategory || [];
  const performanceData = analytics?.performanceDistribution || [];

  return (
    <div className="space-y-6">
      {/* Top Admin Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-2 text-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              University Executive Management Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Campus Administration & Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-purple-100/90 max-w-xl">
              Real-time oversight of 5 academic departments, 3,400+ students, faculty tenure, and campus services.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/students">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/95 text-purple-900 hover:bg-white font-semibold border-0"
                icon={GraduationCap}
              >
                Manage Students
              </Button>
            </Link>
            <Link to="/admin/faculty">
              <Button
                variant="outline"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
                icon={Users}
              >
                Manage Faculty
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl" />
      </div>

      {/* Top 7 Stat Cards per Section 28 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents?.toLocaleString() || "3,420"}
          subtitle="Enrolled across 5 departments"
          trend="+8.2% annual growth"
          trendDirection="up"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Total Faculty"
          value={stats?.totalFaculty || "185"}
          subtitle="1:18.5 faculty-student ratio"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Academic Departments"
          value={stats?.totalDepartments || "5"}
          subtitle="IT, CSE, ECE, MECH, CIVIL"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats?.averageAttendance || 85.4}%`}
          subtitle="Statutory threshold: 75%"
          trend="+1.2% this semester"
          trendDirection="up"
          icon={Clock}
          color="sky"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Academic Marks"
          value={`${stats?.averageMarks || 78.8}%`}
          subtitle="Mid-term assessment score"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Pending Grievances"
          value={stats?.pendingComplaints || "14"}
          subtitle="3 high priority infrastructure tickets"
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests || "28"}
          subtitle="Leave & lab procurement items"
          icon={FileText}
          color="indigo"
        />
      </div>

      {/* Section 28 Charts: Department Students, Attendance Trend, Complaint Statistics, Student Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-Wise Students Donut Chart */}
        <Card
          title="Enrollment by Academic Department"
          subtitle="Distribution of 3,420 registered undergraduate students"
          action={
            <Link to="/admin/departments" className="text-xs font-semibold text-purple-700 hover:text-purple-900">
              Department Details →
            </Link>
          }
        >
          <DeptDistributionChart data={analytics?.deptStudents} height={260} />
        </Card>

        {/* Attendance Statistics Line Chart */}
        <Card
          title="Monthly University Attendance Statistics"
          subtitle="Campus-wide aggregate attendance rate over 2026 academic calendar"
        >
          <AdminTrendChart data={analytics?.attendanceTrends} height={260} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Statistics by Category */}
        <Card
          title="Campus Grievance Distribution by Category"
          subtitle="Analysis of operational tickets filed across campus services"
          action={
            <Link to="/admin/complaints" className="text-xs font-semibold text-purple-700 hover:text-purple-900">
              Manage Tickets →
            </Link>
          }
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={complaintData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Open Complaints" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Student Performance Distribution */}
        <Card
          title="Student Grade & Performance Curve"
          subtitle="Cumulative continuous assessment grade tiers"
          action={
            <Link to="/admin/analytics" className="text-xs font-semibold text-purple-700 hover:text-purple-900">
              Full Analytics →
            </Link>
          }
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Students" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
