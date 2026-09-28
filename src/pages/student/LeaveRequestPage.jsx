import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Plus, Calendar, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const LeaveRequestPage = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await studentService.getLeaves();
        setLeaves(res);
      } catch (err) {
        console.error('Error fetching leaves', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await studentService.applyLeave(formData);
      setLeaves([res.leave, ...leaves]);
      addToast(res.message, 'success');
      setIsApplyModalOpen(false);
      setFormData({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch {
      addToast('Failed to submit leave request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading leave application records..." />;

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply for formal absences, medical leaves, or on-duty hackathon permissions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
            <h4 className="text-xl font-bold text-slate-900">{pendingCount} Applications</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Approved Leaves</p>
            <h4 className="text-xl font-bold text-slate-900">{approvedCount} Leaves</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Semester Quota Used</p>
            <h4 className="text-xl font-bold text-slate-900">4 / 12 Days</h4>
          </div>
        </div>
      </div>

      {/* Leave Application History Table */}
      <Card
        title="Leave History & Status"
        subtitle="Track submitted leave applications, advisor remarks and decision logs"
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Leave ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Applied On</th>
                <th className="py-3 px-4">Advisor Remarks</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {leave.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">{leave.leaveType}</span>
                  </td>
                  <td className="py-3 px-4 text-xs whitespace-nowrap">
                    <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong> ({leave.days || 1} day)
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {leave.reason}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs">
                    {leave.appliedOn}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs italic">
                    {leave.remarks || 'No remarks added yet'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={leave.status} size="sm">
                      {leave.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Leave Modal Form */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave / On-Duty Permission"
        subtitle="Formal request will be routed to your academic advisor for review"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Leave Category
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Sick Leave">Sick / Medical Leave</option>
              <option value="On-Duty (OD)">On-Duty (OD) - Hackathon/Sports</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Reason for Absence
            </label>
            <textarea
              required
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="State clear academic or personal grounds for leave..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Notice:</strong> For Medical Leaves exceeding 2 days, you must produce a physical medical certificate to your advisor upon return.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsApplyModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={CheckCircle2}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveRequestPage;
