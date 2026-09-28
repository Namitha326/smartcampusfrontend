import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import MarksChart from '../../components/charts/MarksChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Award, TrendingUp, BookOpen, CheckCircle, FileSpreadsheet } from 'lucide-react';

export const InternalMarksPage = () => {
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await studentService.getMarks();
        setMarks(res);
      } catch (err) {
        console.error('Error fetching internal marks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  if (loading) return <LoadingSpinner text="Retrieving continuous internal assessment scores..." />;

  const avgTotal = Math.round(
    marks.reduce((acc, curr) => acc + curr.total, 0) / (marks.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Assessment & Grades</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your marks for Internal Test 1, Internal Test 2, and Continuous Assessment Assignments.
        </p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Overall Average"
          value={`${avgTotal} / 100`}
          subtitle="Across all registered subjects"
          trend="+4.2% improvement"
          trendDirection="up"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Highest Score"
          value="95 / 100"
          subtitle="Web Development (IT305)"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Current Grade Standing"
          value="A+ Average"
          subtitle="Estimated SGPA: 8.85"
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Assignments Evaluated"
          value="5 / 5"
          subtitle="100% submission completion"
          icon={BookOpen}
          color="sky"
        />
      </div>

      {/* Performance Comparison Chart */}
      <Card
        title="Performance Comparison: Your Marks vs Class Average"
        subtitle="Benchmark of student scores against the class statistical median"
      >
        <MarksChart height={280} />
      </Card>

      {/* Marks Detailed Table */}
      <Card
        title="Comprehensive Marks Breakdown"
        subtitle="Individual components contributing to 100-mark consolidated grade"
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4 text-center">Internal 1 (50)</th>
                <th className="py-3 px-4 text-center">Internal 2 (50)</th>
                <th className="py-3 px-4 text-center">Assignment (20)</th>
                <th className="py-3 px-4 text-center font-bold">Total (100)</th>
                <th className="py-3 px-4 text-center">Class Avg</th>
                <th className="py-3 px-4 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {marks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{m.subject}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{m.code}</td>
                  <td className="py-3 px-4 text-center font-medium">{m.internal1}</td>
                  <td className="py-3 px-4 text-center font-medium">{m.internal2}</td>
                  <td className="py-3 px-4 text-center font-medium">{m.assignment}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-extrabold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                      {m.total}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">{m.classAverage}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={m.total >= 85 ? 'good' : 'technical'} size="sm">
                      {m.grade}
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

export default InternalMarksPage;
