import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  UploadCloud,
  FileCheck,
  CheckCircle,
  FileText,
  User,
} from 'lucide-react';

export const FacultyAssignments = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '',
    subject: 'Java Programming',
    subjectCode: 'IT301',
    dueDate: '',
    dueTime: '11:59 PM',
    maxMarks: 20,
    description: '',
  });

  // Grade form state
  const [gradeData, setGradeData] = useState({
    marks: 18,
    feedback: 'Well articulated implementation and robust unit tests included.',
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await facultyService.getAssignments();
        setAssignments(res);
      } catch (err) {
        console.error('Error fetching assignments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await facultyService.createAssignment(createForm);
      setAssignments([res.assignment, ...assignments]);
      addToast(res.message, 'success');
      setIsCreateModalOpen(false);
      setCreateForm({
        title: '',
        subject: 'Java Programming',
        subjectCode: 'IT301',
        dueDate: '',
        dueTime: '11:59 PM',
        maxMarks: 20,
        description: '',
      });
    } catch {
      addToast('Failed to create assignment.', 'error');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      const res = await facultyService.gradeSubmission(selectedAssignment.id, {
        marks: gradeData.marks,
        maxMarks: selectedAssignment.maxMarks,
        feedback: gradeData.feedback,
      });
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? {
                ...a,
                status: 'Graded',
                obtainedMarks: gradeData.marks,
                feedback: gradeData.feedback,
              }
            : a
        )
      );
      addToast(res.message, 'success');
      setIsGradeModalOpen(false);
    } catch {
      addToast('Failed to record grade.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving faculty coursework..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignment Coursework Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish problem sets, review submissions, and enter continuous grading assessments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Assignment
        </Button>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asn) => (
          <Card key={asn.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {asn.subject} ({asn.subjectCode})
                </span>
                <Badge variant={asn.status}>{asn.status}</Badge>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-1">{asn.title}</h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {asn.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due: <strong>{asn.dueDate}</strong>
                </span>
                <span>Max: {asn.maxMarks} Marks</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">ID: {asn.id}</span>
              <Button
                variant="outline"
                size="sm"
                icon={FileCheck}
                onClick={() => {
                  setSelectedAssignment(asn);
                  setIsGradeModalOpen(true);
                }}
              >
                Grade / Submissions
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Course Assignment"
        subtitle="This assignment will be immediately visible on enrolled students' dashboards"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Distributed Lock Manager with Redis"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={createForm.subject}
                onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Java Programming">Java Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Structures & Algorithms">Data Structures</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Max Marks
              </label>
              <input
                type="number"
                required
                value={createForm.maxMarks}
                onChange={(e) => setCreateForm({ ...createForm, maxMarks: Number(e.target.value) })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Due Time
              </label>
              <input
                type="text"
                value={createForm.dueTime}
                onChange={(e) => setCreateForm({ ...createForm, dueTime: e.target.value })}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Problem Description & Deliverables
            </label>
            <textarea
              required
              rows={4}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Outline project specifications, grading criteria, and test scenarios..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grade Submissions Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Evaluation: ${selectedAssignment?.title || ''}`}
        subtitle={`Max Marks: ${selectedAssignment?.maxMarks || 20}`}
      >
        <form onSubmit={handleGradeSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div><strong>Student Sample:</strong> Alex Rivera (21IT1042)</div>
            <div><strong>Submitted File:</strong> assignment_solution.pdf (Verified)</div>
            <div><strong>Submission Time:</strong> On-time submission</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Score (Out of {selectedAssignment?.maxMarks})
            </label>
            <input
              type="number"
              min="0"
              max={selectedAssignment?.maxMarks || 20}
              required
              value={gradeData.marks}
              onChange={(e) => setGradeData({ ...gradeData, marks: Number(e.target.value) })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Faculty Feedback & Constructive Remarks
            </label>
            <textarea
              rows={3}
              value={gradeData.feedback}
              onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={CheckCircle}>
              Save Grade & Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyAssignments;
