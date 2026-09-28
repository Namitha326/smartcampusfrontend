import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AttendanceChart from '../../components/charts/AttendanceChart';
import MarksChart from '../../components/charts/MarksChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Clock,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Bell,
  GraduationCap,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your student workspace..." />;

  const stats = data?.stats || {};
  const attendance = data?.attendance || {};
  const assignments = data?.assignments || [];
  const events = data?.events || [];
  const announcements = data?.announcements || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SmartCampus AI Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100/90 max-w-xl">
              {user?.department} • {user?.year} • Section {user?.section} • Reg: {user?.registerNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/career-assistant">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/95 text-indigo-700 hover:bg-white shadow-sm font-semibold border-0"
                icon={Sparkles}
              >
                AI Career Roadmap
              </Button>
            </Link>
            <Link to="/student/leave">
              <Button
                variant="outline"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
                icon={FileText}
              >
                Apply Leave
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${stats.overallAttendance}%`}
          subtitle={`${stats.presentDays} / ${stats.totalWorkingDays} days present`}
          trend="+2.1% this month"
          trendDirection="up"
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Avg Internal Marks"
          value={`${stats.avgInternalMarks}%`}
          subtitle="Top 15% of your class"
          trend="+3.4% vs Int 1"
          trendDirection="up"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Pending Assignments"
          value={stats.pendingAssignments}
          subtitle="1 due in next 48h"
          icon={BookOpen}
          color="amber"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle="HackCampus & AI Workshop"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Progression Chart */}
        <Card
          title="Weekly Attendance Trend"
          subtitle="Semester 6 attendance tracking vs 75% eligibility line"
          action={
            <Link to="/student/attendance" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Detailed Breakdown →
            </Link>
          }
        >
          <AttendanceChart data={attendance.weeklyTrend} height={250} />
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Eligible for final exams (&gt;75%)
            </span>
            <span>Total Attended: {attendance.attendedClasses}/{attendance.totalClasses} lectures</span>
          </div>
        </Card>

        {/* Subject Internal Marks Comparison */}
        <Card
          title="Subject Marks vs Class Average"
          subtitle="Current semester continuous assessment scores"
          action={
            <Link to="/student/marks" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View Grades →
            </Link>
          }
        >
          <MarksChart height={250} />
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest: Web Development (95%)</span>
            <span>Current CGPA: <strong className="text-slate-800">{user?.cgpa || '8.74'}</strong></span>
          </div>
        </Card>
      </div>

      {/* Lower Row: Assignments, Events, Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Assignments */}
        <Card
          title="Actionable Assignments"
          subtitle="Recent submissions and pending tasks"
          action={
            <Link to="/student/assignments" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All ({assignments.length})
            </Link>
          }
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            {assignments.slice(0, 3).map((asn) => (
              <div
                key={asn.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-slate-800 line-clamp-1">{asn.title}</h4>
                  <Badge variant={asn.status} size="sm">
                    {asn.status}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{asn.subject}</span>
                  <span>Due: {asn.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card
          title="Featured Campus Events"
          subtitle="Hackathons, cultural fests and guest lectures"
          action={
            <Link to="/student/events" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Browse Events
            </Link>
          }
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-xs"
              >
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={evt.category} size="sm">
                      {evt.category}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-800 truncate mt-0.5">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500">{evt.date} • {evt.venue.split(' ')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card
          title="Recent Announcements"
          subtitle="Official circulars from controller & departments"
          action={
            <Link to="/student/announcements" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              All Notices
            </Link>
          }
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <Badge variant={ann.category} size="sm">
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <h4 className="font-semibold text-slate-800 line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{ann.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
