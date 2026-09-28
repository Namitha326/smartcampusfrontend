import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Search,
  Plus,
  Pin,
  Trash2,
  Calendar,
  Users,
  Eye,
  Send,
} from 'lucide-react';

export const AdminAnnouncements = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    target: 'All Students & Faculty',
    content: '',
    pinned: false,
  });

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnnouncements();
      setAnnouncements(res);
    } catch (err) {
      console.error('Error fetching announcements', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      addToast('Please fill out all required fields.', 'warning');
      return;
    }

    try {
      const payload = {
        ...formData,
        author: 'Campus Administrative Dean',
      };
      const res = await adminService.createAnnouncement(payload);
      setAnnouncements((prev) => [res.announcement, ...prev]);
      addToast(res.message, 'success');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        category: 'General',
        target: 'All Students & Faculty',
        content: '',
        pinned: false,
      });
    } catch {
      addToast('Failed to broadcast announcement.', 'error');
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    try {
      await adminService.deleteAnnouncement(selectedAnnouncement.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== selectedAnnouncement.id));
      addToast('Announcement removed.', 'success');
      setIsDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    } catch {
      addToast('Failed to delete announcement.', 'error');
    }
  };

  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
    addToast('Pinned notice status updated.', 'info');
  };

  if (loading) return <LoadingSpinner text="Loading campus announcement broadcasts..." />;

  const filtered = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Exam', 'Academic', 'Events', 'General', 'Urgent'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Broadcasts & Circulars</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author and broadcast official circulars, exam schedules, and holiday notices across college departments.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Publish Circular
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by subject, keyword, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No circulars found"
          description="There are no announcements matching your search query or selected category filter."
          actionText="Publish New Circular"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className={`transition-all hover:border-slate-300 ${
                item.pinned ? 'border-amber-300/80 bg-amber-50/15' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                        <Pin className="w-3 h-3 rotate-45" /> Pinned
                      </span>
                    )}
                    <Badge variant={item.category} size="sm">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      By {item.author || 'Admin Dean'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 truncate">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setSelectedAnnouncement(item);
                      setDetailModalOpen(true);
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant={item.pinned ? 'outline' : 'ghost'}
                    size="sm"
                    icon={Pin}
                    onClick={() => togglePin(item.id)}
                    title={item.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    {item.pinned ? 'Pinned' : 'Pin'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => {
                      setSelectedAnnouncement(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Announcement Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Campus Circular"
        subtitle="Publish institutional notices to departments, students, or staff"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <FormInput
            label="Announcement Title"
            required
            placeholder="e.g. End Semester Exam Timetable Announcement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Circular Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Exam', label: 'Exam' },
                { value: 'Academic', label: 'Academic' },
                { value: 'Events', label: 'Events' },
                { value: 'General', label: 'General' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
            />

            <FormSelect
              label="Target Audience"
              required
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              options={[
                { value: 'All Students & Faculty', label: 'All Students & Faculty' },
                { value: 'All Students Only', label: 'All Students Only' },
                { value: 'All Faculty Members Only', label: 'All Faculty Members Only' },
                { value: 'Information Technology Dept', label: 'IT Department' },
                { value: 'Computer Science Dept', label: 'CSE Department' },
              ]}
            />
          </div>

          <FormTextarea
            label="Circular Body / Notice Text"
            required
            rows={5}
            maxLength={600}
            placeholder="Type detailed announcement message, regulations, and instructions here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="pinnedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Pin this circular to top of Student and Faculty Dashboards
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Send}>
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      {selectedAnnouncement && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedAnnouncement.title}
          subtitle={`Published on ${selectedAnnouncement.date} by ${selectedAnnouncement.author || 'Admin Dean'}`}
        >
          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Badge variant={selectedAnnouncement.category}>{selectedAnnouncement.category}</Badge>
              {selectedAnnouncement.pinned && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pinned Broadcast
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
              {selectedAnnouncement.content}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAnnouncement}
        title="Archive Circular Notice"
        message={`Are you sure you want to remove the circular "${selectedAnnouncement?.title}" from campus broadcasts?`}
        confirmText="Archive"
        variant="danger"
      />
    </div>
  );
};

export default AdminAnnouncements;
