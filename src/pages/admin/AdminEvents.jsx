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
  Calendar,
  Search,
  Plus,
  MapPin,
  Clock,
  Users,
  Trash2,
  Eye,
} from 'lucide-react';

export const AdminEvents = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    organizer: 'Campus Tech Council',
    capacity: 150,
    description: '',
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getEvents();
      setEvents(res);
    } catch (err) {
      console.error('Error fetching campus events', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      addToast('Please fill out all mandatory event fields.', 'warning');
      return;
    }

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity) || 100,
        registeredCount: 0,
      };
      const res = await adminService.createEvent(payload);
      setEvents((prev) => [res.event, ...prev]);
      addToast(res.message, 'success');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        category: 'Technical',
        date: '',
        time: '10:00 AM - 04:00 PM',
        venue: '',
        organizer: 'Campus Tech Council',
        capacity: 150,
        description: '',
      });
    } catch {
      addToast('Failed to create campus event.', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await adminService.deleteEvent(selectedEvent.id);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      addToast('Campus event cancelled and removed.', 'success');
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch {
      addToast('Failed to delete event.', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus event calendar..." />;

  const todayStr = '2026-09-28';

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || ev.category === categoryFilter;

    const isUpcoming = ev.date >= todayStr;
    const matchesTab = tab === 'upcoming' ? isUpcoming : !isUpcoming;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const categories = ['All', 'Technical', 'Hackathon', 'Cultural', 'Sports', 'Workshop'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Event Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Schedule college symposiums, hackathons, guest lectures, and manage student registration rosters.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Schedule New Event
        </Button>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === 'upcoming' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === 'past' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Events
          </button>
        </div>

        <div className="flex flex-1 md:max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event title, venue, organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

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

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No events in this view"
          description="There are currently no events matching your selected tab or search query."
          actionText="Create Campus Event"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={item.category}>{item.category}</Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time || '10:00 AM - 04:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{item.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Organized by: <strong className="text-slate-700">{item.organizer}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Capacity: {item.capacity || 100} seats
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setSelectedEvent(item);
                      setDetailModalOpen(true);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => {
                      setSelectedEvent(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Campus Event"
        subtitle="Publish a college symposium, technical workshop, or hackathon"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <FormInput
            label="Event Title"
            required
            placeholder="e.g. National Level Smart Campus Hackathon 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Event Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Technical', label: 'Technical' },
                { value: 'Hackathon', label: 'Hackathon' },
                { value: 'Cultural', label: 'Cultural' },
                { value: 'Workshop', label: 'Workshop' },
                { value: 'Sports', label: 'Sports' },
              ]}
            />

            <FormInput
              label="Event Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Event Time Window"
              required
              placeholder="e.g. 09:30 AM - 04:30 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />

            <FormInput
              label="Venue / Hall"
              required
              placeholder="e.g. Main Auditorium / Lab 3"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Organizer / Club"
              required
              placeholder="e.g. Dept of IT & AI Club"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />

            <FormInput
              label="Participant Capacity"
              type="number"
              min="10"
              max="1000"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Event Description & Eligibility"
            required
            rows={4}
            maxLength={500}
            placeholder="Outline event rules, deliverables, prize pools, or guest speaker profiles..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Calendar}>
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Event Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedEvent.title}
          subtitle={`Organized by ${selectedEvent.organizer}`}
        >
          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Badge variant={selectedEvent.category}>{selectedEvent.category}</Badge>
              <span className="text-xs text-slate-500 font-medium">
                Scheduled for {selectedEvent.date}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <p className="leading-relaxed">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600 border-t border-slate-200/60">
                <div><strong>Venue:</strong> {selectedEvent.venue}</div>
                <div><strong>Timing:</strong> {selectedEvent.time}</div>
                <div><strong>Capacity:</strong> {selectedEvent.capacity || 150} seats</div>
                <div><strong>Status:</strong> {selectedEvent.date >= todayStr ? 'Upcoming' : 'Concluded'}</div>
              </div>
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
        onConfirm={handleDeleteEvent}
        title="Cancel Campus Event"
        message={`Are you sure you want to cancel and remove "${selectedEvent?.title}" from the campus calendar?`}
        confirmText="Cancel Event"
        variant="danger"
      />
    </div>
  );
};

export default AdminEvents;
