import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  BookOpen,
  MapPin,
  GraduationCap,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export const FacultyProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Sarah Jenkins',
    email: user?.email || 'sarah.jenkins@smartcampus.edu',
    phone: user?.phone || '+1 (555) 762-1190',
    facultyId: user?.facultyId || 'FAC-IT-042',
    department: user?.department || 'Information Technology',
    designation: user?.designation || 'Associate Professor & Lab Head',
    officeRoom: user?.officeRoom || 'Tech Block B, Room 304',
    qualifications: user?.qualifications || 'Ph.D. in Computer Science, M.Tech in Software Engineering',
    coursesHandled: user?.coursesHandled || ['Java Programming', 'Web Development', 'Cloud Architecture'],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
            alt={formData.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-50 shadow-md"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{formData.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ID: <span className="text-emerald-700 font-semibold">{formData.facultyId}</span> • {formData.department}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="good" size="sm">{formData.designation}</Badge>
              <Badge variant="technical" size="sm">{formData.officeRoom}</Badge>
            </div>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <Button variant="outline" icon={Edit2} onClick={() => setIsEditing(true)}>
              Edit Faculty Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={X} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={Save} onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Form Details */}
      <Card title="Faculty Academic Credentials" subtitle="Institutional faculty records and contact information">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name & Title
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Faculty Identification Code
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="facultyId"
                  disabled={!isEditing}
                  value={formData.facultyId}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Direct Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="department"
                  disabled={!isEditing}
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Office / Consultation Room
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="officeRoom"
                  disabled={!isEditing}
                  value={formData.officeRoom}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Qualifications & Degrees
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="qualifications"
                disabled={!isEditing}
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Courses Handled this Academic Year
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.coursesHandled.map((course, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FacultyProfile;
