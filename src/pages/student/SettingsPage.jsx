import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Lock, Bell, Shield, Smartphone, Globe, CheckCircle } from 'lucide-react';

export const SettingsPage = () => {
  const { addToast } = useAuth();
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationToggles, setNotificationToggles] = useState({
    emailAlerts: true,
    assignmentReminders: true,
    examNotices: true,
    eventInvites: false,
    chatbotDigest: true,
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    addToast('Security credentials updated successfully!', 'success');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast('Preference saved.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your login security, institutional communication channels, and campus portal preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security & Password */}
        <Card title="Security & Authentication" subtitle="Update your campus single-sign-on credentials">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <Button type="submit" variant="primary" icon={Lock} className="w-full">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Communication Preferences */}
        <Card title="Notification Preferences" subtitle="Control which automated campus alerts you receive">
          <div className="space-y-4">
            {[
              { id: 'emailAlerts', title: 'Institutional Email Alerts', desc: 'Critical circulars, emergency announcements, and term notices' },
              { id: 'assignmentReminders', title: 'Assignment Due Reminders', desc: 'Alerts 48h and 12h prior to deadline expiration' },
              { id: 'examNotices', title: 'Exam Hall Ticket & Schedule Alerts', desc: 'Immediate notification when exam schedules are finalized' },
              { id: 'eventInvites', title: 'Campus Hackathon & Event Invites', desc: 'Workshops, tech club announcements and cultural fests' },
              { id: 'chatbotDigest', title: 'AI Assistant Weekly Digest', desc: 'Summary of skills progression and recommended roadmaps' },
            ].map((pref) => (
              <div key={pref.id} className="flex items-start justify-between gap-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{pref.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(pref.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    notificationToggles[pref.id] ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notificationToggles[pref.id] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
