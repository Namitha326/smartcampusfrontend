import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Bell,
  Search,
  Pin,
  Calendar,
  User,
  CheckCircle,
  Eye,
  Filter,
} from 'lucide-react';

export const AnnouncementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await studentService.getAnnouncements();
        setAnnouncements(res);
      } catch (err) {
        console.error('Error fetching announcements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleOpenDetail = (ann) => {
    setSelectedAnnouncement(ann);
    // Mark as read locally
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === ann.id ? { ...a, isRead: true } : a))
    );
  };

  if (loading) return <LoadingSpinner text="Retrieving university bulletins..." />;

  const filtered = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || ann.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Academic', 'Exam', 'Events', 'General', 'Important'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">University Circulars & Notices</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official administrative memos, exam notifications, holiday schedules, and recruitment bulletins.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notices by keyword, department, or circular title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No notices found"
          description="Try broadening your search keywords or resetting the category filter."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('All');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <Card
              key={ann.id}
              onClick={() => handleOpenDetail(ann)}
              className={`hover:border-slate-300 transition-all ${
                !ann.isRead ? 'border-l-4 border-l-indigo-600 bg-indigo-50/15' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {ann.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        <Pin className="w-3 h-3 fill-amber-700" />
                        Pinned Notice
                      </span>
                    )}
                    <Badge variant={ann.category} size="sm">
                      {ann.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      Dept: <strong>{ann.department}</strong>
                    </span>
                    {!ann.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 flex-shrink-0 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ann.date}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">By {ann.author}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Announcement Detail Modal */}
      <Modal
        isOpen={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title}
        subtitle={`${selectedAnnouncement?.category} • ${selectedAnnouncement?.date}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
            <div>
              <strong>Issued by:</strong> {selectedAnnouncement?.author} ({selectedAnnouncement?.authorRole})
            </div>
            <div>•</div>
            <div>
              <strong>Target Audience:</strong> {selectedAnnouncement?.department} ({selectedAnnouncement?.targetYear})
            </div>
          </div>

          <div className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">
            {selectedAnnouncement?.content}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Official circular verified by Registrar Office</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedAnnouncement(null)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementsPage;
