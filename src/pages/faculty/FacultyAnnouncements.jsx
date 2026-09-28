import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, Plus, Calendar, Trash2 } from 'lucide-react';

export const FacultyAnnouncements = () => {
  const { addToast } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    department: 'Information Technology',
    targetYear: '3rd Year',
    content: '',
  });

  useEffect(() => {
    const fetchAnn = async () => {
      try {
        const res = await studentService.getAnnouncements();
        setAnnouncements(res);
      } catch (err) {
        console.error('Error fetching announcements', err);
      }
    };
    fetchAnn();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await facultyService.createAnnouncement(formData);
      setAnnouncements([res.announcement, ...announcements]);
      addToast(res.message, 'success');
      setFormData({
        title: '',
        category: 'Academic',
        department: 'Information Technology',
        targetYear: '3rd Year',
        content: '',
      });
    } catch {
      addToast('Failed to broadcast circular.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast('Notice deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Broadcast Announcements</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Issue notices, project specifications, and test schedules directly to your enrolled student batches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <Card
          title="Compose Notice"
          subtitle="Direct broadcast to student portals"
          className="lg:col-span-1"
        >
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Announcement Subject
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Lab Exam Batch 1 Timetable"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Academic">Academic</option>
                <option value="Exam">Exam / Internal Test</option>
                <option value="Events">Workshop / Hackathon</option>
                <option value="Important">Urgent / Important</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="Information Technology">IT</option>
                  <option value="Computer Science">CSE</option>
                  <option value="All Departments">All Depts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Batch
                </label>
                <select
                  name="targetYear"
                  value={formData.targetYear}
                  onChange={handleChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="All Years">All Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Notice Message Content
              </label>
              <textarea
                required
                rows={4}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Type complete details, deadlines, or room numbers..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={Send}
              className="w-full"
            >
              Broadcast to Students
            </Button>
          </form>
        </Card>

        {/* Existing Announcements List */}
        <Card
          title="Published Department Circulars"
          subtitle="Live announcements currently visible to students"
          className="lg:col-span-2"
        >
          <div className="space-y-3.5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.category} size="sm">
                      {ann.category}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      Target: {ann.department} ({ann.targetYear})
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mt-2">
                  {ann.title}
                </h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {ann.content}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Posted on {ann.date}
                  </span>
                  <span>By {ann.author}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyAnnouncements;
