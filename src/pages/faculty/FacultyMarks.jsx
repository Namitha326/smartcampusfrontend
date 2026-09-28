import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Award, Save, CheckCircle, AlertTriangle } from 'lucide-react';

export const FacultyMarks = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [classConfig, setClassConfig] = useState({
    classId: 'CLS-1',
    subject: 'Java Programming',
    exam: 'Internal 1',
    maxMarks: 50,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await facultyService.getStudentsForMarks(classConfig);
        setStudents(res);
      } catch (err) {
        console.error('Error fetching marks list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classConfig.subject, classConfig.exam]);

  const handleMarkChange = (studentId, value) => {
    const num = Number(value);
    if (num > classConfig.maxMarks) {
      addToast(`Marks cannot exceed ${classConfig.maxMarks}`, 'error');
      return;
    }
    if (num < 0) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, marks: num } : s))
    );
  };

  const handleSaveMarks = async () => {
    setIsSaving(true);
    try {
      const res = await facultyService.saveMarks({
        ...classConfig,
        marks: students.map((s) => ({ id: s.id, score: s.marks })),
      });
      addToast(res.message, 'success');
    } catch {
      addToast('Failed to save marks records.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Assessment Marks Entry</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Input, modify, validate, and publish continuous internal evaluation scores for your courses.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          loading={isSaving}
          onClick={handleSaveMarks}
        >
          Save & Publish Marks
        </Button>
      </div>

      {/* Selectors Card */}
      <Card title="Assessment Parameters">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Course / Subject
            </label>
            <select
              value={classConfig.subject}
              onChange={(e) => setClassConfig({ ...classConfig, subject: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
            >
              <option value="Java Programming">Java Programming (IT301)</option>
              <option value="Web Development">Web Development (IT305)</option>
              <option value="Cloud Architecture">Cloud Architecture (IT402)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Examination Component
            </label>
            <select
              value={classConfig.exam}
              onChange={(e) => setClassConfig({ ...classConfig, exam: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium"
            >
              <option value="Internal 1">Internal Test 1 (Max 50)</option>
              <option value="Internal 2">Internal Test 2 (Max 50)</option>
              <option value="Continuous Assignment">Continuous Assignment (Max 20)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Assigned Class / Section
            </label>
            <input
              type="text"
              readOnly
              value="IT - 3rd Year - Section A (48 Students)"
              className="w-full text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-600"
            />
          </div>
        </div>
      </Card>

      {/* Marks Input Table */}
      <Card
        title={`Student Scoresheet: ${classConfig.exam} (${classConfig.subject})`}
        subtitle={`Maximum allowable score: ${classConfig.maxMarks} Marks`}
      >
        {loading ? (
          <LoadingSpinner text="Retrieving class rolls..." />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4 text-center">Marks Input (Max: {classConfig.maxMarks})</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-right">Evaluated Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student, idx) => {
                  const pct = Math.round((student.marks / classConfig.maxMarks) * 100);
                  const isPassing = pct >= 50;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{student.regNo}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={classConfig.maxMarks}
                            value={student.marks}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            className="w-20 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-xs"
                          />
                          <span className="text-xs text-slate-400">/ {classConfig.maxMarks}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            pct >= 85
                              ? 'bg-emerald-50 text-emerald-700'
                              : isPassing
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        <Badge
                          variant={pct >= 85 ? 'good' : isPassing ? 'technical' : 'rejected'}
                          size="sm"
                        >
                          {pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : isPassing ? 'B' : 'RA'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacultyMarks;
