import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';

export const FacultyStudentRequests = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('Approve'); // 'Approve' | 'Reject'
  const [remarks, setRemarks] = useState('');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await facultyService.getStudentRequests();
        setRequests(res);
      } catch (err) {
        console.error('Error fetching student requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleOpenActionModal = (req, action) => {
    setSelectedRequest(req);
    setActionType(action);
    setRemarks(action === 'Approve' ? 'Approved based on academic standing.' : 'Insufficient justification.');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const res = await facultyService.actionStudentRequest(
        selectedRequest.id,
        actionType,
        remarks
      );
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, status: actionType === 'Approve' ? 'Approved' : 'Rejected' } : r
        )
      );
      addToast(res.message, actionType === 'Approve' ? 'success' : 'info');
      setIsActionModalOpen(false);
    } catch {
      addToast('Failed to update request state.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching pending student approvals..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Request Approvals</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review on-duty leaves, medical absence notices, and mark re-evaluation applications.
        </p>
      </div>

      {/* Requests List */}
      <Card title="Pending Review Queue">
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={req.status === 'Approved' ? 'approved' : req.status === 'Rejected' ? 'rejected' : 'pending'}>
                    {req.status}
                  </Badge>
                  <span className="font-bold text-slate-900">{req.studentName}</span>
                  <span className="text-xs font-mono text-slate-400">({req.studentReg})</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">{req.type}</h4>
                <p className="text-xs text-slate-600">{req.details}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {req.dates}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {req.status === 'Pending' ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleOpenActionModal(req, 'Approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleOpenActionModal(req, 'Reject')}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">
                    Decision Recorded: {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType} Request: ${selectedRequest?.type}`}
        subtitle={`Student: ${selectedRequest?.studentName} (${selectedRequest?.studentReg})`}
      >
        <form onSubmit={handleConfirmAction} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>Request Details:</strong> {selectedRequest?.details}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Advisor Remarks & Instructions
            </label>
            <textarea
              required
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add justification or feedback for the student..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionType === 'Approve' ? 'success' : 'danger'}
            >
              Confirm {actionType}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyStudentRequests;
