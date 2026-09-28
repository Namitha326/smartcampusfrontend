import api from './api';
import {
  MOCK_FACULTY_STATS,
  MOCK_FACULTY_CLASSES,
  MOCK_STUDENTS_LIST,
  MOCK_FACULTY_REQUESTS,
  MOCK_ASSIGNMENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_USERS,
} from '../data/mockData';

const mockDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const facultyService = {
  // Expected Future Backend Endpoint: GET /api/faculty/dashboard
  getDashboard: async () => {
    await mockDelay();
    // return api.get('/faculty/dashboard');
    return {
      stats: MOCK_FACULTY_STATS,
      profile: MOCK_USERS.faculty,
      classes: MOCK_FACULTY_CLASSES,
      pendingRequests: MOCK_FACULTY_REQUESTS,
      recentAnnouncements: MOCK_ANNOUNCEMENTS.slice(0, 3),
    };
  },

  // Expected Future Backend Endpoint: GET /api/faculty/classes
  getClasses: async () => {
    await mockDelay();
    // return api.get('/faculty/classes');
    return MOCK_FACULTY_CLASSES;
  },

  // Expected Future Backend Endpoint: GET /api/faculty/attendance?dept=...&year=...&sec=...&subject=...&date=...
  getStudentsForAttendance: async (params) => {
    await mockDelay();
    // return api.get('/faculty/attendance', { params });
    return MOCK_STUDENTS_LIST;
  },

  // Expected Future Backend Endpoint: POST /api/faculty/attendance
  saveAttendance: async (payload) => {
    await mockDelay(300);
    // return api.post('/faculty/attendance', payload);
    return {
      success: true,
      message: `Attendance marked successfully for ${payload.records?.length || 0} students!`,
      date: payload.date,
      subject: payload.subject,
    };
  },

  // Expected Future Backend Endpoint: GET /api/faculty/marks?classId=...&exam=...
  getStudentsForMarks: async (params) => {
    await mockDelay();
    // return api.get('/faculty/marks', { params });
    return MOCK_STUDENTS_LIST.map(stu => ({
      ...stu,
      internal1: stu.marks,
      internal2: Math.min(50, stu.marks + Math.floor(Math.random() * 5) - 2),
      assignment: 19,
    }));
  },

  // Expected Future Backend Endpoint: POST /api/faculty/marks
  saveMarks: async (payload) => {
    await mockDelay(300);
    // return api.post('/faculty/marks', payload);
    return {
      success: true,
      message: `Marks recorded successfully for ${payload.subject}!`,
    };
  },

  // Expected Future Backend Endpoint: GET /api/faculty/assignments
  getAssignments: async () => {
    await mockDelay();
    // return api.get('/faculty/assignments');
    return MOCK_ASSIGNMENTS;
  },

  // Expected Future Backend Endpoint: POST /api/faculty/assignments
  createAssignment: async (assignmentData) => {
    await mockDelay(300);
    // return api.post('/faculty/assignments', assignmentData);
    const newAssignment = {
      id: `ASN-${Math.floor(200 + Math.random() * 800)}`,
      ...assignmentData,
      status: 'Pending',
      obtainedMarks: null,
      submittedDate: null,
      feedback: null,
    };
    return {
      success: true,
      assignment: newAssignment,
      message: 'New assignment published for students successfully!',
    };
  },

  // Expected Future Backend Endpoint: POST /api/faculty/assignments/:id/grade
  gradeSubmission: async (id, gradeData) => {
    await mockDelay(250);
    // return api.post(`/faculty/assignments/${id}/grade`, gradeData);
    return {
      success: true,
      message: `Graded assignment successfully (${gradeData.marks}/${gradeData.maxMarks})!`,
    };
  },

  // Expected Future Backend Endpoint: GET /api/faculty/requests
  getStudentRequests: async () => {
    await mockDelay();
    // return api.get('/faculty/requests');
    return MOCK_FACULTY_REQUESTS;
  },

  // Expected Future Backend Endpoint: POST /api/faculty/requests/:id/action
  actionStudentRequest: async (id, action, remarks) => {
    await mockDelay(250);
    // return api.post(`/faculty/requests/${id}/action`, { action, remarks });
    return {
      success: true,
      requestId: id,
      action,
      remarks,
      message: `Request ${action.toLowerCase()} successfully.`,
    };
  },

  // Expected Future Backend Endpoint: POST /api/faculty/announcements
  createAnnouncement: async (announcementData) => {
    await mockDelay(300);
    // return api.post('/faculty/announcements', announcementData);
    const newAnnouncement = {
      id: `ANN-${Math.floor(200 + Math.random() * 800)}`,
      ...announcementData,
      date: new Date().toISOString().split('T')[0],
      author: 'Dr. Sarah Jenkins',
      authorRole: 'Faculty',
      pinned: false,
      isRead: false,
    };
    return {
      success: true,
      announcement: newAnnouncement,
      message: 'Announcement broadcasted successfully!',
    };
  }
};

export default facultyService;
