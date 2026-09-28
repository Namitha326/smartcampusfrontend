import api from './api';
import {
  MOCK_USERS,
  MOCK_STUDENT_STATS,
  MOCK_ATTENDANCE,
  MOCK_MARKS,
  MOCK_ASSIGNMENTS,
  MOCK_EVENTS,
  MOCK_LEAVES,
  MOCK_COMPLAINTS,
  MOCK_LOST_AND_FOUND,
  MOCK_ANNOUNCEMENTS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';

const mockDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  // Expected Future Backend Endpoint: GET /api/students/dashboard
  getDashboard: async () => {
    await mockDelay();
    // return api.get('/students/dashboard');
    return {
      stats: MOCK_STUDENT_STATS,
      profile: MOCK_USERS.student,
      attendance: MOCK_ATTENDANCE,
      marks: MOCK_MARKS,
      assignments: MOCK_ASSIGNMENTS,
      events: MOCK_EVENTS.slice(0, 3),
      announcements: MOCK_ANNOUNCEMENTS.slice(0, 4),
    };
  },

  // Expected Future Backend Endpoint: GET /api/students/profile
  getProfile: async () => {
    await mockDelay();
    // return api.get('/students/profile');
    return MOCK_USERS.student;
  },

  // Expected Future Backend Endpoint: PUT /api/students/profile
  updateProfile: async (updatedData) => {
    await mockDelay();
    // return api.put('/students/profile', updatedData);
    const existing = MOCK_USERS.student;
    const merged = { ...existing, ...updatedData };
    localStorage.setItem('smartcampus_user', JSON.stringify(merged));
    return merged;
  },

  // Expected Future Backend Endpoint: GET /api/students/attendance
  getAttendance: async () => {
    await mockDelay();
    // return api.get('/students/attendance');
    return MOCK_ATTENDANCE;
  },

  // Expected Future Backend Endpoint: GET /api/students/marks
  getMarks: async () => {
    await mockDelay();
    // return api.get('/students/marks');
    return MOCK_MARKS;
  },

  // Expected Future Backend Endpoint: GET /api/students/assignments
  getAssignments: async () => {
    await mockDelay();
    // return api.get('/students/assignments');
    return MOCK_ASSIGNMENTS;
  },

  // Expected Future Backend Endpoint: POST /api/students/assignments/:id/submit
  submitAssignment: async (id, fileData) => {
    await mockDelay(300);
    // return api.post(`/students/assignments/${id}/submit`, fileData);
    return {
      success: true,
      assignmentId: id,
      submittedDate: new Date().toISOString(),
      fileName: fileData.fileName || 'submission.pdf',
      status: 'Submitted',
      message: 'Assignment submitted successfully!',
    };
  },

  // Expected Future Backend Endpoint: GET /api/events
  getEvents: async () => {
    await mockDelay();
    // return api.get('/events');
    return MOCK_EVENTS;
  },

  // Expected Future Backend Endpoint: POST /api/events/:id/register
  registerEvent: async (id) => {
    await mockDelay(200);
    // return api.post(`/events/${id}/register`);
    return { success: true, eventId: id, message: 'Successfully registered for event!' };
  },

  // Expected Future Backend Endpoint: GET /api/leave
  getLeaves: async () => {
    await mockDelay();
    // return api.get('/leave');
    return MOCK_LEAVES;
  },

  // Expected Future Backend Endpoint: POST /api/leave
  applyLeave: async (leaveData) => {
    await mockDelay(300);
    // return api.post('/leave', leaveData);
    const newLeave = {
      id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: leaveData.days || 1,
      reason: leaveData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      remarks: 'Application under review by department faculty advisor.',
    };
    return { success: true, leave: newLeave, message: 'Leave application submitted successfully!' };
  },

  // Expected Future Backend Endpoint: GET /api/complaints
  getComplaints: async () => {
    await mockDelay();
    // return api.get('/complaints');
    return MOCK_COMPLAINTS;
  },

  // Expected Future Backend Endpoint: POST /api/complaints
  submitComplaint: async (complaintData) => {
    await mockDelay(300);
    // return api.post('/complaints', complaintData);
    const newComplaint = {
      id: `CMP-${Math.floor(5000 + Math.random() * 4000)}`,
      ticketNumber: `TCK-${Math.floor(9000 + Math.random() * 999)}`,
      category: complaintData.category,
      title: complaintData.title,
      description: complaintData.description,
      status: 'Submitted',
      filedDate: new Date().toISOString().split('T')[0],
      studentName: 'Alex Rivera',
      studentId: '21IT1042',
      priority: complaintData.priority || 'Medium',
      assignedTo: 'Campus Help Desk',
      adminRemarks: 'Ticket logged into system queue.',
    };
    return { success: true, complaint: newComplaint, message: 'Complaint registered successfully!' };
  },

  // Expected Future Backend Endpoint: GET /api/lost-found
  getLostAndFound: async () => {
    await mockDelay();
    // return api.get('/lost-found');
    return MOCK_LOST_AND_FOUND;
  },

  // Expected Future Backend Endpoint: POST /api/lost-found
  reportLostFound: async (itemData) => {
    await mockDelay(300);
    // return api.post('/lost-found', itemData);
    const newItem = {
      id: `LNF-${Math.floor(10 + Math.random() * 90)}`,
      ...itemData,
      date: new Date().toISOString().split('T')[0],
      status: 'Reported',
    };
    return { success: true, item: newItem, message: `${itemData.type} report posted successfully!` };
  },

  // Expected Future Backend Endpoint: GET /api/announcements
  getAnnouncements: async () => {
    await mockDelay();
    // return api.get('/announcements');
    return MOCK_ANNOUNCEMENTS;
  },

  // Expected Future Backend Endpoint: GET /api/notifications
  getNotifications: async () => {
    await mockDelay();
    // return api.get('/notifications');
    return MOCK_NOTIFICATIONS;
  },
};

export default studentService;
