import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/StudentProfile';
import AttendancePage from '../pages/student/AttendancePage';
import InternalMarksPage from '../pages/student/InternalMarksPage';
import AssignmentsPage from '../pages/student/AssignmentsPage';
import EventsPage from '../pages/student/EventsPage';
import LeaveRequestPage from '../pages/student/LeaveRequestPage';
import ComplaintsPage from '../pages/student/ComplaintsPage';
import LostAndFoundPage from '../pages/student/LostAndFoundPage';
import AnnouncementsPage from '../pages/student/AnnouncementsPage';
import AiCareerAssistant from '../pages/student/AiCareerAssistant';
import NotificationsPage from '../pages/student/NotificationsPage';
import SettingsPage from '../pages/student/SettingsPage';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyProfile from '../pages/faculty/FacultyProfile';
import FacultyAttendance from '../pages/faculty/FacultyAttendance';
import FacultyMarks from '../pages/faculty/FacultyMarks';
import FacultyAssignments from '../pages/faculty/FacultyAssignments';
import FacultyStudentRequests from '../pages/faculty/FacultyStudentRequests';
import FacultyAnnouncements from '../pages/faculty/FacultyAnnouncements';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminFaculty from '../pages/admin/AdminFaculty';
import AdminDepartments from '../pages/admin/AdminDepartments';
import AdminRequests from '../pages/admin/AdminRequests';
import AdminComplaints from '../pages/admin/AdminComplaints';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, redirect to their role dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

export const AppRoutes = () => {
  const { role, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Student Module Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="marks" element={<InternalMarksPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="leave" element={<LeaveRequestPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="lost-found" element={<LostAndFoundPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="career-assistant" element={<AiCareerAssistant />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Faculty Module Protected Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="profile" element={<FacultyProfile />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="marks" element={<FacultyMarks />} />
        <Route path="assignments" element={<FacultyAssignments />} />
        <Route path="requests" element={<FacultyStudentRequests />} />
        <Route path="announcements" element={<FacultyAnnouncements />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Module Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
            <h2 className="text-xl font-bold text-slate-800 mt-2">Campus Page Not Found</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              The page you are looking for doesn't exist or has moved.
            </p>
            <a
              href="/"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700"
            >
              Return to Portal Home
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
