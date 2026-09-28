import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Users, GraduationCap, DollarSign, Layers } from 'lucide-react';

export const AdminDepartments = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hod: '',
    studentCount: 500,
    facultyCount: 30,
    labsCount: 6,
    budget: '$200,000',
  });

  const fetchDepts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getDepartments();
      setDepartments(res);
    } catch (err) {
      console.error('Error fetching departments', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepts();
  }, [fetchDepts]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      code: '',
      hod: 'Dr. Jane Smith',
      studentCount: 400,
      facultyCount: 25,
      labsCount: 5,
      budget: '$180,000',
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setIsEditing(true);
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      hod: dept.hod,
      studentCount: dept.studentCount,
      facultyCount: dept.facultyCount,
      labsCount: dept.labsCount,
      budget: dept.budget,
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDept(dept);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await adminService.updateDepartment(selectedDept.id, formData);
        setDepartments((prev) =>
          prev.map((d) => (d.id === selectedDept.id ? { ...d, ...formData } : d))
        );
        addToast(res.message, 'success');
      } else {
        const res = await adminService.addDepartment(formData);
        setDepartments([...departments, res.department]);
        addToast(res.message, 'success');
      }
      setIsAddEditModalOpen(false);
    } catch {
      addToast('Operation failed.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDept) return;
    try {
      const res = await adminService.deleteDepartment(selectedDept.id);
      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id));
      addToast(res.message, 'info');
      setIsDeleteDialogOpen(false);
    } catch {
      addToast('Failed to delete department.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus faculties & departments..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain institutional departments, appointed Heads of Department, lab facilities, and budgets.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add New Department
        </Button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {dept.code}
                </span>
                <Badge variant="good" size="sm">Active</Badge>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mt-1">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1">HOD: <strong className="text-slate-800">{dept.hod}</strong></p>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span><strong>{dept.studentCount}</strong> Students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>{dept.facultyCount}</strong> Faculty</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Layers className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span><strong>{dept.labsCount}</strong> High-Tech Labs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Budget: <strong>{dept.budget}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">ID: {dept.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                  title="Edit Department"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(dept)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors"
                  title="Archive Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={isEditing ? `Edit Department: ${formData.name}` : 'Register New Academic Department'}
        subtitle="Establish department code, leadership, and budget allocation"
      >
        <form onSubmit={handleSaveDept} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Biomedical Engineering"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="BME"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Head of Department (HOD)
            </label>
            <input
              type="text"
              required
              value={formData.hod}
              onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
              placeholder="Dr. Full Name"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Students
              </label>
              <input
                type="number"
                value={formData.studentCount}
                onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Faculty Count
              </label>
              <input
                type="number"
                value={formData.facultyCount}
                onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Labs
              </label>
              <input
                type="number"
                value={formData.labsCount}
                onChange={(e) => setFormData({ ...formData, labsCount: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Annual Operating Budget
            </label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="$200,000"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsAddEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Save Changes' : 'Establish Department'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Archive Academic Department"
        message={`Are you sure you want to delete ${selectedDept?.name} (${selectedDept?.code})?`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default AdminDepartments;
