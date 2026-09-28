import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import facultyService from '../../services/facultyService';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AttendanceChart from '../../components/charts/AttendanceChart';
import MarksChart from '../../components/charts/MarksChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  CheckSquare,
  Clock,
  BookOpen,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  FileCheck,
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await facultyService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error loading faculty dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading faculty academic portal..." />;

  const stats = data?.stats || {};
  const classes = data?.classes || [];
  const pendingRequests = data?.pendingRequests || [];
  const announcements = data?.recentAnnouncements || [];

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Faculty Command Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Faculty Member'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              {user?.designation} • {user?.department} • Handled Courses: Java, Web Development
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/faculty/attendance">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/95 text-emerald-800 hover:bg-white font-semibold border-0"
                icon={CheckSquare}
              >
                Mark Attendance
              </Button>
            </Link>
            <Link to="/faculty/marks">
              <Button
                variant="outline"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
                icon={FileCheck}
              >
                Enter Marks
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl" />
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Assigned Students"
          value={stats.totalStudents || 142}
          subtitle="Across 3 sections (IT-A, IT-B, IT-4A)"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Today's Attendance Rate"
          value={`${stats.todayAttendanceRate || 91.2}%`}
          subtitle="130 of 142 marked present"
          trend="+1.8% vs last week"
          trendDirection="up"
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="Pending Student Requests"
          value={stats.pendingRequests || 6}
          subtitle="Leave & mark re-evaluations"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active Assignments"
          value={stats.activeAssignments || 4}
          subtitle="3 currently under evaluation"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* Charts & Classroom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Department Attendance Trends"
          subtitle="Average percentage attendance of your assigned sections"
        >
          <AttendanceChart height={250} />
        </Card>

        <Card
          title="Class Performance Distribution"
          subtitle="Continuous internal assessment grade curve across classes"
        >
          <MarksChart height={250} />
        </Card>
      </div>

      {/* Lower Row: Assigned Classes & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Handled */}
        <Card
          title="Assigned Classes & Batches"
          subtitle="Courses currently under your instructional charge"
          action={
            <Link to="/faculty/attendance" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              Take Attendance →
            </Link>
          }
        >
          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{cls.subject}</h4>
                  <p className="text-xs text-slate-500">
                    {cls.department} • {cls.year} • Sec {cls.section} ({cls.code})
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-indigo-600">
                    {cls.totalStudents} Students
                  </span>
                  <p className="text-[11px] text-slate-400">Class Room 302</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Student Requests */}
        <Card
          title="Student Requests Needing Action"
          subtitle="Leave permits, on-duty approvals, and grade clarifications"
          action={
            <Link to="/faculty/requests" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              Review All →
            </Link>
          }
        >
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{req.studentName}</span>
                    <span className="text-[11px] font-mono text-slate-400">({req.studentReg})</span>
                    <Badge variant="pending" size="sm">{req.type}</Badge>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{req.details}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{req.dates}</p>
                </div>

                <Link to="/faculty/requests">
                  <Button variant="outline" size="sm">
                    Action
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
