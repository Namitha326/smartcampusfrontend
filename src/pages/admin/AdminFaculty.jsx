import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export const AdminFaculty = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    phone: '+1 (555) 000-0000',
    experience: '5 Years',
    courses: 'Software Engineering',
  });

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getFaculty({ department: deptFilter });
      setFaculty(res);
    } catch (err) {
      console.error('Error fetching faculty', err);
    } finally {
      setLoading(false);
    }
  }, [deptFilter]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      phone: '+1 (555) 444-1234',
      experience: '4 Years',
      courses: 'Object Oriented Programming',
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setIsEditing(true);
    setSelectedFaculty(fac);
    setFormData({
      name: fac.name,
      email: fac.email,
      department: fac.department,
      designation: fac.designation,
      phone: fac.phone,
      experience: fac.experience,
      courses: Array.isArray(fac.courses) ? fac.courses.join(', ') : fac.courses,
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenDelete = (fac) => {
    setSelectedFaculty(fac);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenView = (fac) => {
    setSelectedFaculty(fac);
    setIsViewModalOpen(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await adminService.updateFaculty(selectedFaculty.id, formData);
        setFaculty((prev) =>
          prev.map((f) => (f.id === selectedFaculty.id ? { ...f, ...formData } : f))
        );
        addToast(res.message, 'success');
      } else {
        const res = await adminService.addFaculty(formData);
        setFaculty([res.faculty, ...faculty]);
        addToast(res.message, 'success');
      }
      setIsAddEditModalOpen(false);
    } catch {
      addToast('Operation failed.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFaculty) return;
    try {
      const res = await adminService.deleteFaculty(selectedFaculty.id);
      setFaculty((prev) => prev.filter((f) => f.id !== selectedFaculty.id));
      addToast(res.message, 'info');
      setIsDeleteDialogOpen(false);
    } catch {
      addToast('Failed to delete faculty member.', 'error');
    }
  };

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const departments = ['All', 'Information Technology', 'Computer Science', 'Electronics'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty & Instructional Staff</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage academic appointments, department affiliations, designations, and workload allocations.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Appoint New Faculty
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by faculty name or official email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
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

      {/* Faculty Table */}
      <Card title={`Active Faculty Directory (${filtered.length} Professors)`}>
        {loading ? (
          <LoadingSpinner text="Querying faculty register..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No faculty members match"
            description="Clear search or change department filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setDeptFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Courses Handled</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 block">{fac.name}</span>
                        <span className="text-xs text-slate-400 font-mono">{fac.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{fac.department}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{fac.designation}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {Array.isArray(fac.courses) ? fac.courses.join(', ') : fac.courses}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-500">{fac.experience}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(fac)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(fac)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Edit Faculty"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(fac)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Faculty"
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

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={isEditing ? `Edit Faculty: ${formData.name}` : 'Appoint New Faculty Member'}
        subtitle="Provide academic credentials and institutional email"
      >
        <form onSubmit={handleSaveFaculty} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name & Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Alan Turing"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@smartcampus.edu"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>
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
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="HOD & Professor">HOD & Professor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Courses Handled (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.courses}
              onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
              placeholder="e.g. Distributed Systems, Cloud Computing"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Save Changes' : 'Appoint Faculty'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Faculty Record Profile"
        subtitle={selectedFaculty?.designation}
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <span className="font-bold text-slate-900">{selectedFaculty?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{selectedFaculty?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span>{selectedFaculty?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Experience:</span>
              <span>{selectedFaculty?.experience}</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Faculty Member"
        message={`Are you sure you want to delete ${selectedFaculty?.name}? Their course assignments will need re-allocation.`}
        confirmText="Confirm Removal"
      />
    </div>
  );
};

export default AdminFaculty;
