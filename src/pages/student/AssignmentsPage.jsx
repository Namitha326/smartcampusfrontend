import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Search,
  Filter,
  UploadCloud,
  FileCheck,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const AssignmentsPage = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Submit Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await studentService.getAssignments();
        setAssignments(res);
      } catch (err) {
        console.error('Error fetching assignments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleOpenSubmitModal = (asn) => {
    setSelectedAssignment(asn);
    setSelectedFile(null);
    setIsSubmitModalOpen(true);
  };

  const handleMockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setIsSubmitting(true);

    try {
      const res = await studentService.submitAssignment(selectedAssignment.id, {
        fileName: selectedFile?.name || 'assignment_submission.pdf',
      });
      // Update local state
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                status: 'Submitted',
                submittedDate: new Date().toLocaleString(),
                submissionFile: selectedFile?.name || 'assignment_solution.pdf',
              }
            : a
        )
      );
      addToast(res.message, 'success');
      setIsSubmitModalOpen(false);
    } catch {
      addToast('Submission failed, please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading assignments..." />;

  // Filter logic
  const filteredAssignments = assignments.filter((asn) => {
    const matchesSearch =
      asn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || asn.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || asn.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const subjects = ['All', ...new Set(assignments.map((a) => a.subject))];
  const statuses = ['All', 'Pending', 'Submitted', 'Late', 'Graded'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Course Assignments</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review problem sets, project submissions, deadlines, and faculty evaluations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments by title, subject or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub === 'All' ? 'All Subjects' : sub}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments match your criteria"
          description="Try clearing your search filters to view your pending and submitted assignments."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSubjectFilter('All');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAssignments.map((asn) => {
            const isPending = asn.status === 'Pending';
            const isGraded = asn.status === 'Graded';

            return (
              <Card
                key={asn.id}
                className="flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {asn.subject} • {asn.subjectCode}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-2 leading-snug">
                        {asn.title}
                      </h3>
                    </div>
                    <Badge variant={asn.status}>{asn.status}</Badge>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {asn.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: <strong>{asn.dueDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>By: {asn.dueTime}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Evaluator: {asn.faculty}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Max Marks: {asn.maxMarks}
                    </div>
                  </div>

                  {/* If Graded: Show Marks and Faculty Feedback */}
                  {isGraded && (
                    <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs text-emerald-900">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Score: {asn.obtainedMarks} / {asn.maxMarks}</span>
                        <span className="text-[11px] uppercase font-bold text-emerald-700">Graded</span>
                      </div>
                      {asn.feedback && (
                        <p className="mt-1 text-slate-600 italic">"{asn.feedback}"</p>
                      )}
                    </div>
                  )}

                  {/* If Submitted: Show submission metadata */}
                  {asn.status === 'Submitted' && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium truncate">
                        <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {asn.submissionFile || 'solution_submitted.pdf'}
                      </span>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {asn.submittedDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    ID: {asn.id}
                  </span>

                  {isPending ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UploadCloud}
                      onClick={() => handleOpenSubmitModal(asn)}
                    >
                      Submit Assignment
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileText}
                      onClick={() => handleOpenSubmitModal(asn)}
                    >
                      Re-upload / View
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Submission Modal Dialog */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title || ''}`}
        subtitle={`Course: ${selectedAssignment?.subject} • Due: ${selectedAssignment?.dueDate}`}
      >
        <form onSubmit={handleMockSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            <strong>Submission Instructions:</strong> Ensure code repositories or PDF deliverables are cleanly formatted. Max file size: 25MB.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select or Drag & Drop Submission File
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {selectedFile ? selectedFile.name : 'Click or drag files here to upload'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, ZIP, TAR, DOCX</p>
              <input
                type="file"
                className="hidden"
                id="file-upload-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <label
                htmlFor="file-upload-input"
                className="mt-3 inline-block px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                Browse Files
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Student Remarks / Repository Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GitHub repo link or specific execution notes"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;
