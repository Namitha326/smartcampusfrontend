import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Search, Edit2 } from 'lucide-react';

export const AdminComplaints = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Update Status Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('In Progress');
  const [assignedTo, setAssignedTo] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getComplaints();
      setComplaints(res);
    } catch (err) {
      console.error('Error fetching complaints', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleOpenUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setAssignedTo(complaint.assignedTo || 'Campus Maintenance Team');
    setRemarks(complaint.adminRemarks || '');
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      const res = await adminService.updateComplaint(selectedComplaint.id, {
        status: updateStatus,
        assignedTo,
        adminRemarks: remarks,
      });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id
            ? { ...c, status: updateStatus, assignedTo, adminRemarks: remarks }
            : c
        )
      );
      addToast(res.message, 'success');
      setIsModalOpen(false);
    } catch {
      addToast('Failed to update complaint status.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus grievance records..." />;

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All', 'Academic', 'Hostel', 'Transport', 'Infrastructure', 'Faculty', 'Other'];
  const statuses = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Complaint Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review lodged grievances across hostels, labs, academic departments, and dispatch maintenance crews.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by subject, ticket number or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="hover:border-slate-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {item.ticketNumber}
                  </span>
                  <Badge variant={item.category} size="sm">{item.category}</Badge>
                  <Badge variant={item.priority} size="sm">{item.priority} Priority</Badge>
                  <span className="text-xs text-slate-400">Filed: {item.filedDate}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                  <span>Student: <strong>{item.studentName}</strong> ({item.studentId})</span>
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 flex-shrink-0">
                <Badge variant={item.status} dot size="md">
                  {item.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => handleOpenUpdate(item)}
                >
                  Update & Assign
                </Button>
              </div>
            </div>

            {/* Admin remarks / status update notes */}
            {item.adminRemarks && (
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <span className="font-bold text-slate-900 whitespace-nowrap">
                  Assigned Team ({item.assignedTo}):
                </span>
                <span>{item.adminRemarks}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Update Complaint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Update Ticket: ${selectedComplaint?.ticketNumber}`}
        subtitle={selectedComplaint?.title}
      >
        <form onSubmit={handleSaveUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Resolution Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assign To Team / Officer
              </label>
              <input
                type="text"
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Campus Electrical Division"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Administrative Remarks / Resolution Log
            </label>
            <textarea
              required
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="State work orders issued, parts replaced, or justification..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={CheckCircle}>
              Save Ticket Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminComplaints;
