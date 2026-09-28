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
  Search,
  Plus,
  MapPin,
  Calendar,
  Phone,
  Mail,
  UploadCloud,
  CheckCircle,
  HelpCircle,
  Tag,
} from 'lucide-react';

export const LostAndFoundPage = () => {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [activeType, setActiveType] = useState('All'); // 'All' | 'Lost' | 'Found'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Lost',
    itemName: '',
    category: 'Electronics',
    location: '',
    description: '',
    contactName: 'Alex Rivera',
    contactPhone: '+1 (555) 382-9012',
    contactEmail: 'alex.rivera@smartcampus.edu',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    const fetchLostFound = async () => {
      try {
        const res = await studentService.getLostAndFound();
        setItems(res);
      } catch (err) {
        console.error('Error fetching lost & found', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLostFound();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await studentService.reportLostFound(formData);
      setItems([res.item, ...items]);
      addToast(res.message, 'success');
      setIsReportModalOpen(false);
      setFormData({
        type: 'Lost',
        itemName: '',
        category: 'Electronics',
        location: '',
        description: '',
        contactName: 'Alex Rivera',
        contactPhone: '+1 (555) 382-9012',
        contactEmail: 'alex.rivera@smartcampus.edu',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
      });
    } catch {
      addToast('Failed to submit notice.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Searching campus lost & found depository..." />;

  const filteredItems = items.filter((item) => {
    const matchesType = activeType === 'All' || item.type === activeType;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Electronics', 'Documents', 'Personal Items', 'Keys', 'Books'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Lost & Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Community-driven lost item recovery and found property turn-in registry.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsReportModalOpen(true)}
        >
          Report Lost or Found Item
        </Button>
      </div>

      {/* Type Toggle & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Lost vs Found Pills */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-xs">
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeType === t
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'All' ? 'All Items' : `${t} Items`}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-1 max-w-lg items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item name, location or details..."
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

      {/* Item Cards Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No lost & found listings match your criteria"
          description="Have you lost or found something on campus? Be the first to report it."
          actionLabel="Report an Item"
          onAction={() => setIsReportModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isLost = item.type === 'Lost';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Image and Badges */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider ${
                          isLost
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {item.type}
                      </span>
                      <Badge variant={item.category} size="sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span>Date: {item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span>{item.contactName}: {item.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {item.id}
                  </span>
                  <a
                    href={`mailto:${item.contactEmail}?subject=Regarding ${item.type} Item: ${item.itemName}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Contact Finder / Owner
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Post Lost or Found Notice"
        subtitle="Provide accurate information so the owner or finder can connect with you"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Lost' })}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'Lost'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Found' })}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'Found'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              I Found Something
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Item Name / Model
            </label>
            <input
              type="text"
              required
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. Casio Calculator, Blue Umbrella, Keyring"
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
                <option value="Electronics">Electronics / Gadgets</option>
                <option value="Documents">ID Cards & Documents</option>
                <option value="Personal Items">Bags / Personal Items</option>
                <option value="Keys">Keys / Locks</option>
                <option value="Books">Books / Stationery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campus Location
              </label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Library 2nd Floor, Room 302"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description & Distinguishing Marks
            </label>
            <textarea
              required
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Color, brand, stickers, scratches, contents..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                required
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(false)}
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
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LostAndFoundPage;
