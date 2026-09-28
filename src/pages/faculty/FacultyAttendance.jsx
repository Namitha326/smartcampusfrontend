import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare,
  Users,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';

export const FacultyAttendance = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    department: 'Information Technology',
    year: '3rd Year',
    section: 'A',
    subject: 'Java Programming',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await facultyService.getStudentsForAttendance(filters);
        setStudents(res);
      } catch (err) {
        console.error('Error fetching students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [filters.department, filters.year, filters.section, filters.subject]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleToggleAttendance = (studentId) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' }
          : s
      )
    );
  };

  const handleMarkAll = (statusToSet) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: statusToSet })));
    addToast(`Marked all students as ${statusToSet}`, 'info');
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const res = await facultyService.saveAttendance({
        ...filters,
        records: students.map((s) => ({ id: s.id, status: s.status })),
      });
      addToast(res.message, 'success');
    } catch {
      addToast('Failed to save attendance records.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.filter((s) => s.status === 'Absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Attendance Marking</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record class presence, lecture hours, and synchronize attendance logs with the campus registry.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          loading={isSaving}
          onClick={handleSaveAttendance}
        >
          Save & Commit Attendance
        </Button>
      </div>

      {/* Selectors Bar */}
      <Card title="Session Filter & Class Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Section
            </label>
            <select
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Subject Course
            </label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="Java Programming">Java Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Cloud Architecture">Cloud Architecture</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Session Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
            </input>
          </div>
        </div>

        {/* Bulk Action Controls & Presence Counts */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              Total Enrolled: <strong>{students.length}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">
              Present: {presentCount}
            </span>
            <span className="text-rose-700 font-semibold">
              Absent: {absentCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleMarkAll('Present')}
            >
              Mark All Present
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={XCircle}
              onClick={() => handleMarkAll('Absent')}
            >
              Clear All
            </Button>
          </div>
        </div>
      </Card>

      {/* Student List with Present/Absent Toggle Controls */}
      <Card
        title={`${filters.subject} Attendance Registry`}
        subtitle={`${filters.department} • ${filters.year} Sec ${filters.section} • Date: ${filters.date}`}
      >
        {loading ? (
          <LoadingSpinner text="Fetching class roll list..." />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4 text-center">Historical Attendance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student, idx) => {
                  const isPresent = student.status === 'Present';

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isPresent ? 'hover:bg-slate-50/70' : 'bg-rose-50/20 hover:bg-rose-50/40'
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {student.regNo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium text-slate-700">{student.attendance}%</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={student.status} size="sm">
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {/* Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(student.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                            isPresent
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Absent
                            </>
                          )}
                        </button>
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

export default FacultyAttendance;
