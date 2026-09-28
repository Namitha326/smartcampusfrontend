import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  FileText,
  AlertCircle,
  HelpCircle,
  Bell,
  Sparkles,
  Settings,
  Users,
  GraduationCap,
  Building2,
  CheckSquare,
  BarChart3,
  Search,
  MessageSquareWarning,
  Clock,
  Layers,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { role, user, logout } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/student/profile', icon: UserCheck },
    { name: 'Attendance', path: '/student/attendance', icon: Clock },
    { name: 'Internal Marks', path: '/student/marks', icon: Award },
    { name: 'Assignments', path: '/student/assignments', icon: BookOpen },
    { name: 'Events', path: '/student/events', icon: Calendar },
    { name: 'Leave Request', path: '/student/leave', icon: FileText },
    { name: 'Complaints', path: '/student/complaints', icon: AlertCircle },
    { name: 'Lost & Found', path: '/student/lost-found', icon: Search },
    { name: 'Announcements', path: '/student/announcements', icon: Bell },
    { name: 'AI Career Assistant', path: '/student/career-assistant', icon: Sparkles, badge: 'AI' },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const facultyLinks = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Faculty Profile', path: '/faculty/profile', icon: UserCheck },
    { name: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
    { name: 'Marks Entry', path: '/faculty/marks', icon: Award },
    { name: 'Assignments', path: '/faculty/assignments', icon: BookOpen },
    { name: 'Student Requests', path: '/faculty/requests', icon: FileText },
    { name: 'Announcements', path: '/faculty/announcements', icon: Bell },
    { name: 'Notifications', path: '/faculty/notifications', icon: Bell },
    { name: 'Settings', path: '/faculty/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Manage Faculty', path: '/admin/faculty', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Student Requests', path: '/admin/requests', icon: FileText },
    { name: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Campus Events', path: '/admin/events', icon: Calendar },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = {
    student: studentLinks,
    faculty: facultyLinks,
    admin: adminLinks,
  }[role] || studentLinks;

  const roleTitles = {
    student: 'Student Portal',
    faculty: 'Faculty Console',
    admin: 'Admin Operations',
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Mobile Header / Close */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
        <span className="font-bold text-slate-800 text-sm">{roleTitles[role]}</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Tag & Subheading */}
      <div className="px-5 py-4 border-b border-slate-100 hidden lg:block">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Navigation
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
            {role}
          </span>
        </div>
      </div>

      {/* Nav Items Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile Mini-Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-9 h-9 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.department || role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 z-20 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10 animate-slideRight">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
