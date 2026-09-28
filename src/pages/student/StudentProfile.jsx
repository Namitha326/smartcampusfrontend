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
  GraduationCap,
  Calendar,
  Layers,
  Globe,
  Edit2,
  Save,
  X,
  Plus,
  Sparkles,
  Camera,
  ExternalLink,
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);


export const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    registerNumber: user?.registerNumber || '21IT1042',
    email: user?.email || 'alex.rivera@smartcampus.edu',
    phone: user?.phone || '+1 (555) 382-9012',
    department: user?.department || 'Information Technology',
    year: user?.year || '3rd Year',
    section: user?.section || 'A',
    skills: user?.skills || ['Java', 'JavaScript', 'React', 'SQL', 'DSA'],
    github: user?.github || 'https://github.com/alexrivera-dev',
    linkedin: user?.linkedin || 'https://linkedin.com/in/alex-rivera-tech',
    bio: user?.bio || 'Passionate CS & IT undergraduate specializing in full-stack development and distributed systems.',
  });

  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
            />
            {isEditing && (
              <button
                type="button"
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{formData.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Reg No: <span className="text-indigo-600 font-semibold">{formData.registerNumber}</span> • {formData.department}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="good" size="sm">
                {formData.year} - Sec {formData.section}
              </Badge>
              <Badge variant="technical" size="sm">
                CGPA: {user?.cgpa || '8.74'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <Button
              variant="outline"
              icon={Edit2}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={X}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Details Form */}
      <Card title="Student Information" subtitle="Official academic and communication records">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
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
                Register Number
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="registerNumber"
                  disabled={!isEditing}
                  value={formData.registerNumber}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Institutional Email
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
                Contact Phone
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
                Academic Year & Section
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="year"
                  disabled={!isEditing}
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="3rd Year"
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  name="section"
                  disabled={!isEditing}
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="A"
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bio statement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Bio / Objectives
            </label>
            <textarea
              name="bio"
              rows={3}
              disabled={!isEditing}
              value={formData.bio}
              onChange={handleChange}
              className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="github"
                  disabled={!isEditing}
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="linkedin"
                  disabled={!isEditing}
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 disabled:bg-slate-100/60 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Verified Technical Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium"
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. TypeScript, Docker)"
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-500"
                />
                <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfile;
