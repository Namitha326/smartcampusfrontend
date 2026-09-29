import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FileUpload from '../../components/forms/FileUpload';
import { useAuth } from '../../context/AuthContext';
import {
  AlertCircle,
  Plus,
  Search,
  CheckCircle,
  Clock,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

export const ComplaintsPage = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Infrastructure',
    description: '',
    priority: 'Medium',
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await studentService.getComplaints();
        setComplaints(res);
      } catch (err) {
        console.error('Error fetching complaints', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await studentService.submitComplaint(formData);
      setComplaints([res.complaint, ...complaints]);
      addToast(res.message, 'success');
      setIsSubmitModalOpen(false);
      setFormData({
        title: '',
        category: 'Infrastructure',
        description: '',
        priority: 'Medium',
      });
      setSelectedFile(null);
    } catch {
      addToast('Failed to file grievance.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving student grievance registry..." />;

  const categories = [
    'All',
    'Academic',
    'Hostel',
    'Transport',
    'Infrastructure',
    'Faculty',
    'Other',
  ];

  const filtered = complaints.filter(
    (c) => categoryFilter === 'All' || c.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grievance & Redressal Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lodge institutional complaints, track review progress, and view administrative resolution notes.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsSubmitModalOpen(true)}
        >
          Lodge New Complaint
        </Button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grievance Tracking List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {item.ticketNumber}
                    </span>
                    <Badge variant={item.category} size="sm">
                      {item.category}
                    </Badge>
                    <Badge variant={item.priority} size="sm">
                      {item.priority} Priority
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0">
                <Badge variant={item.status} dot size="md">
                  {item.status}
                </Badge>
                <span className="text-[11px] text-slate-400">
                  Filed on {item.filedDate}
                </span>
              </div>
            </div>

            {/* Admin Resolution & Assignment Remarks Box */}
            {item.adminRemarks && (
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl text-xs flex items-start gap-2 text-slate-700">
                <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Assigned To ({item.assignedTo}): </strong>
                  <span>{item.adminRemarks}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Lodge Complaint Modal Dialog */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Lodge Institutional Complaint"
        subtitle="Your complaint will be encrypted and assigned to the relevant department head"
      >
        <form onSubmit={handleSubmitComplaint} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Complaint Subject / Title
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Laboratory AC unit malfunction in Lab 3"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Academic">Academic / Faculty</option>
                <option value="Hostel">Hostel & Mess</option>
                <option value="Transport">Campus Transport</option>
                <option value="Infrastructure">Infrastructure / Labs</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Urgency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description & Incident Location
            </label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide exact classroom numbers, dates, times, and impact..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <FileUpload
            label="Supporting Evidence / Photo (Optional)"
            helperText="Attach photo or diagnostic screenshot (JPG, PNG, PDF up to 10MB)"
            onFileSelect={(file) => setSelectedFile(file)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsSubmitModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={CheckCircle}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintsPage;
