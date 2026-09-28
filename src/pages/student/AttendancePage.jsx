import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import AttendanceChart from '../../components/charts/AttendanceChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Clock,
  CalendarCheck,
  CalendarX,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const AttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await studentService.getAttendance();
        setAttendance(res);
      } catch (err) {
        console.error('Error fetching attendance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <LoadingSpinner text="Calculating semester attendance..." />;

  const overall = attendance?.overallPercentage || 88.5;
  const attended = attendance?.attendedClasses || 78;
  const absent = attendance?.absentClasses || 10;
  const total = attendance?.totalClasses || 88;
  const subjects = attendance?.subjects || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Attendance</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your semester attendance, subject-wise percentages, and exam eligibility status.
        </p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${overall}%`}
          subtitle="Requirement: Min 75%"
          trend="+2.1% this week"
          trendDirection="up"
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Attended Lectures"
          value={attended}
          subtitle="Hours present in class"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Absent Sessions"
          value={absent}
          subtitle="Allowed absences: 12"
          icon={CalendarX}
          color="rose"
        />
        <StatCard
          title="Total Working Days"
          value={total}
          subtitle="Scheduled instructional periods"
          icon={CalendarDays}
          color="sky"
        />
      </div>

      {/* Visual Gauges and Trend Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Percentage Gauge Card */}
        <Card
          title="Attendance Eligibility Gauge"
          subtitle="University statutory regulation threshold"
          className="lg:col-span-1 flex flex-col justify-between"
        >
          <div className="flex flex-col items-center justify-center py-6">
            {/* SVG Circular Progress Meter */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={overall >= 75 ? "#4f46e5" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * overall) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900">{overall}%</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Overall Rate
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              {overall >= 75 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Eligible for Semester End Exams
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Shortage of Attendance (Below 75%)
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100">
            <strong>Rule:</strong> Students with attendance between 65%-74% require medical condonation.
          </div>
        </Card>

        {/* Weekly Trend Chart */}
        <Card
          title="Weekly Attendance Trend"
          subtitle="Week-by-week presence pattern across all 5 courses"
          className="lg:col-span-2"
        >
          <AttendanceChart data={attendance?.weeklyTrend} height={260} />
        </Card>
      </div>

      {/* Subject-Wise Progress & Responsive Table */}
      <Card
        title="Subject-Wise Attendance Breakdown"
        subtitle="Current semester courses attendance status and faculty in-charge"
      >
        {/* Subject Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {subjects.map((sub) => {
            const isSafe = sub.percentage >= 75;
            return (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{sub.name}</h4>
                    <p className="text-xs text-slate-500">{sub.code} • {sub.faculty}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isSafe ? 'text-indigo-600' : 'text-rose-600'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.percentage >= 90
                        ? 'bg-emerald-500'
                        : sub.percentage >= 75
                        ? 'bg-indigo-600'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>Classes: {sub.attended} / {sub.total}</span>
                  <Badge variant={sub.status} size="sm">
                    {sub.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
                <th className="py-3 px-4 text-center">Attended / Total</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{sub.name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{sub.code}</td>
                  <td className="py-3 px-4 text-slate-600">{sub.faculty}</td>
                  <td className="py-3 px-4 text-center font-semibold">
                    {sub.attended} / {sub.total}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                        sub.percentage >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={sub.status} size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendancePage;
