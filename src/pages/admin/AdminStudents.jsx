import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export const AdminStudents = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    department: 'Information Technology',
    year: '3rd Year',
    section: 'A',
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getStudents({
        department: departmentFilter,
      });
      setStudents(res);
    } catch (err) {
      console.error('Error fetching students', err);
    } finally {
      setLoading(false);
    }
  }, [departmentFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      regNo: `21IT${Math.floor(1000 + Math.random() * 900)}`,
      department: 'Information Technology',
      year: '3rd Year',
      section: 'A',
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (stu) => {
    setIsEditing(true);
    setSelectedStudent(stu);
    setFormData({
      name: stu.name,
      regNo: stu.regNo,
      department: stu.department,
      year: stu.year,
      section: stu.section,
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenDelete = (stu) => {
    setSelectedStudent(stu);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenView = (stu) => {
    setSelectedStudent(stu);
    setIsViewModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await adminService.updateStudent(selectedStudent.id, formData);
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...formData } : s))
        );
        addToast(res.message, 'success');
      } else {
        const res = await adminService.addStudent(formData);
        setStudents([res.student, ...students]);
        addToast(res.message, 'success');
      }
      setIsAddEditModalOpen(false);
    } catch {
      addToast('Operation failed.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      const res = await adminService.deleteStudent(selectedStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
      addToast(res.message, 'info');
      setIsDeleteDialogOpen(false);
    } catch {
      addToast('Failed to delete student.', 'error');
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const departments = ['All', 'Information Technology', 'Computer Science', 'Electronics'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Enrollment Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain undergraduate records, admissions registry, attendance status, and cohort assignments.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Enroll New Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <Card title={`Active Student Roll (${filtered.length} Enrolled)`}>
        {loading ? (
          <LoadingSpinner text="Searching student directory..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No students match criteria"
            description="Adjust your search or department filter."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Register Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Year & Sec</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{stu.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{stu.regNo}</td>
                    <td className="py-3 px-4 text-slate-600">{stu.department}</td>
                    <td className="py-3 px-4">{stu.year} - {stu.section}</td>
                    <td className="py-3 px-4 text-center font-semibold">
                      <span className={stu.attendance >= 75 ? 'text-emerald-700' : 'text-rose-700'}>
                        {stu.attendance}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={stu.status} size="sm">
                        {stu.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(stu)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(stu)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(stu)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={isEditing ? `Edit Student: ${formData.name}` : 'Enroll New Student'}
        subtitle="Complete academic registry credentials"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Maya Lin"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Register Number
            </label>
            <input
              type="text"
              required
              value={formData.regNo}
              onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year & Section
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="Sec"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Save Changes' : 'Enroll Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Record Profile"
        subtitle={`Register Number: ${selectedStudent?.regNo}`}
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <span className="font-bold text-slate-900">{selectedStudent?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{selectedStudent?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Class:</span>
              <span>{selectedStudent?.year} - Section {selectedStudent?.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attendance:</span>
              <span className="font-bold text-indigo-600">{selectedStudent?.attendance}%</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Confirmation Dialog before Delete */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Student from Directory"
        message={`Are you sure you want to delete ${selectedStudent?.name} (${selectedStudent?.regNo})? This will archive all academic and attendance records.`}
        confirmText="Yes, Delete Student"
      />
    </div>
  );
};

export default AdminStudents;
