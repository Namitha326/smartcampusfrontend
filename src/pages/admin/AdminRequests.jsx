import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, Eye, Calendar } from 'lucide-react';

export const AdminRequests = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState('Approve');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await adminService.getRequests();
        setRequests(res);
      } catch (err) {
        console.error('Error fetching admin requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleOpenAction = (req, action) => {
    setSelectedRequest(req);
    setActionType(action);
    setRemarks(action === 'Approve' ? 'Approved by University Administration' : 'Rejected due to administrative policy constraint');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const res = await adminService.actionRequest(selectedRequest.id, actionType, remarks);
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: actionType === 'Approve' ? 'Approved' : 'Rejected' } : r))
      );
      addToast(res.message, actionType === 'Approve' ? 'success' : 'info');
      setIsActionModalOpen(false);
    } catch {
      addToast('Failed to record action.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching institutional approval requests..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Request Clearances</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Approve student off-campus event leaves, faculty laboratory equipment grants, and special clearances.
        </p>
      </div>

      {/* Requests Table */}
      <Card title="Pending Central Administration Requests">
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
                  <span className="font-bold text-slate-900">{req.requester}</span>
                  <span className="text-xs font-mono text-slate-400">({req.id})</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  {req.requestCategory || req.leaveType || 'Administrative Request'}
                </h4>
                <p className="text-xs text-slate-600">{req.details || req.reason}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Date: {req.appliedOn || req.startDate}
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => {
                    setSelectedRequest(req);
                    setIsViewModalOpen(true);
                  }}
                >
                  View
                </Button>
                {req.status === 'Pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleOpenAction(req, 'Approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleOpenAction(req, 'Reject')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Institutional Request Details"
        subtitle={`ID: ${selectedRequest?.id}`}
      >
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
            <div><strong>Requester:</strong> {selectedRequest?.requester}</div>
            <div><strong>Category:</strong> {selectedRequest?.requestCategory || selectedRequest?.leaveType}</div>
            <div><strong>Reason/Justification:</strong> {selectedRequest?.details || selectedRequest?.reason}</div>
            <div><strong>Status:</strong> {selectedRequest?.status}</div>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Action Dialog */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType} Request: ${selectedRequest?.id}`}
        subtitle={`Requester: ${selectedRequest?.requester}`}
      >
        <form onSubmit={handleConfirmAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Admin Remarks & Authorization Code
            </label>
            <textarea
              required
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={actionType === 'Approve' ? 'success' : 'danger'}>
              Confirm {actionType}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRequests;
