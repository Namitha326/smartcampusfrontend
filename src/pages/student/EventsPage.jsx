import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle,
  Tag,
  Sparkles,
} from 'lucide-react';

export const EventsPage = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await studentService.getEvents();
        setEvents(res);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleToggleRegistration = async (eventId) => {
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    const newStatus = !target.registered;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              registered: newStatus,
              seatsBooked: newStatus ? e.seatsBooked + 1 : e.seatsBooked - 1,
            }
          : e
      )
    );

    addToast(
      newStatus
        ? `Successfully registered for ${target.title}!`
        : `Cancelled registration for ${target.title}`,
      newStatus ? 'success' : 'info'
    );
  };

  if (loading) return <LoadingSpinner text="Fetching campus events and workshops..." />;

  const filteredEvents = events.filter((evt) => {
    const isUpcoming = evt.status === 'Upcoming';
    const matchesTab = activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || evt.category === categoryFilter;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Technical', 'Workshop', 'Cultural', 'Sports'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Life & Events</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore student hackathons, academic symposia, workshops, and cultural tournaments.
        </p>
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Upcoming vs Past Tabs */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-xs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Archives
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-1 max-w-lg items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event name, speaker or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 shadow-card"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-card"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} events found`}
          description="Try changing the category filter or search keywords."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Event Banner Image with Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={evt.category} size="sm">
                      {evt.category}
                    </Badge>
                  </div>
                  {evt.registered && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Registered
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">Organized by {evt.organizer}</span>
                    </div>
                  </div>

                  {/* Seat availability bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Capacity</span>
                      <span>{evt.seatsBooked} / {evt.seatsTotal} spots filled</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (evt.seatsBooked / evt.seatsTotal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                {activeTab === 'upcoming' ? (
                  <Button
                    variant={evt.registered ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleRegistration(evt.id)}
                  >
                    {evt.registered ? 'Cancel Registration' : 'Register Now'}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full" disabled>
                    Event Concluded
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
