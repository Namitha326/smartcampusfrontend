import api from './api';
import {
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_ANALYTICS,
  MOCK_ADMIN_DEPARTMENTS,
  MOCK_FACULTY_LIST,
  MOCK_STUDENTS_LIST,
  MOCK_COMPLAINTS,
  MOCK_LEAVES,
  MOCK_ANNOUNCEMENTS,
  MOCK_EVENTS,
} from '../data/mockData';

const mockDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  // Expected Future Backend Endpoint: GET /api/admin/dashboard
  getDashboardStats: async () => {
    await mockDelay();
    // return api.get('/admin/dashboard');
    return MOCK_ADMIN_STATS;
  },

  // Expected Future Backend Endpoint: GET /api/admin/analytics
  getAnalytics: async () => {
    await mockDelay();
    // return api.get('/admin/analytics');
    return MOCK_ADMIN_ANALYTICS;
  },

  // Expected Future Backend Endpoint: GET /api/admin/students
  getStudents: async (filters = {}) => {
    await mockDelay();
    // return api.get('/admin/students', { params: filters });
    let list = [...MOCK_STUDENTS_LIST];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q));
    }
    if (filters.department && filters.department !== 'All') {
      list = list.filter(s => s.department === filters.department);
    }
    return list;
  },

  // Expected Future Backend Endpoint: POST /api/admin/students
  addStudent: async (studentData) => {
    await mockDelay(300);
    // return api.post('/admin/students', studentData);
    const newStudent = {
      id: `STU-${Math.floor(20 + Math.random() * 80)}`,
      ...studentData,
      attendance: 100,
      marks: 0,
      status: 'Present',
    };
    return { success: true, student: newStudent, message: 'Student enrolled successfully!' };
  },

  // Expected Future Backend Endpoint: PUT /api/admin/students/:id
  updateStudent: async (id, updatedData) => {
    await mockDelay(250);
    // return api.put(`/admin/students/${id}`, updatedData);
    return { success: true, student: { id, ...updatedData }, message: 'Student record updated successfully!' };
  },

  // Expected Future Backend Endpoint: DELETE /api/admin/students/:id
  deleteStudent: async (id) => {
    await mockDelay(250);
    // return api.delete(`/admin/students/${id}`);
    return { success: true, id, message: 'Student removed from registry.' };
  },

  // Expected Future Backend Endpoint: GET /api/admin/faculty
  getFaculty: async (filters = {}) => {
    await mockDelay();
    // return api.get('/admin/faculty', { params: filters });
    let list = [...MOCK_FACULTY_LIST];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q));
    }
    if (filters.department && filters.department !== 'All') {
      list = list.filter(f => f.department === filters.department);
    }
    return list;
  },

  // Expected Future Backend Endpoint: POST /api/admin/faculty
  addFaculty: async (facultyData) => {
    await mockDelay(300);
    // return api.post('/admin/faculty', facultyData);
    const newFac = {
      id: `FAC-0${Math.floor(7 + Math.random() * 20)}`,
      ...facultyData,
      courses: typeof facultyData.courses === 'string' ? facultyData.courses.split(',') : facultyData.courses,
    };
    return { success: true, faculty: newFac, message: 'Faculty member added successfully!' };
  },

  // Expected Future Backend Endpoint: PUT /api/admin/faculty/:id
  updateFaculty: async (id, updatedData) => {
    await mockDelay(250);
    // return api.put(`/admin/faculty/${id}`, updatedData);
    return { success: true, faculty: { id, ...updatedData }, message: 'Faculty member updated successfully!' };
  },

  // Expected Future Backend Endpoint: DELETE /api/admin/faculty/:id
  deleteFaculty: async (id) => {
    await mockDelay(250);
    // return api.delete(`/admin/faculty/${id}`);
    return { success: true, id, message: 'Faculty member removed from records.' };
  },

  // Expected Future Backend Endpoint: GET /api/admin/departments
  getDepartments: async () => {
    await mockDelay();
    // return api.get('/admin/departments');
    return MOCK_ADMIN_DEPARTMENTS;
  },

  // Expected Future Backend Endpoint: POST /api/admin/departments
  addDepartment: async (deptData) => {
    await mockDelay(300);
    // return api.post('/admin/departments', deptData);
    const newDept = {
      id: `DEP-0${Math.floor(6 + Math.random() * 10)}`,
      ...deptData,
      status: 'Active',
    };
    return { success: true, department: newDept, message: 'Department registered successfully!' };
  },

  // Expected Future Backend Endpoint: PUT /api/admin/departments/:id
  updateDepartment: async (id, updatedData) => {
    await mockDelay(250);
    // return api.put(`/admin/departments/${id}`, updatedData);
    return { success: true, department: { id, ...updatedData }, message: 'Department updated successfully!' };
  },

  // Expected Future Backend Endpoint: DELETE /api/admin/departments/:id
  deleteDepartment: async (id) => {
    await mockDelay(250);
    // return api.delete(`/admin/departments/${id}`);
    return { success: true, id, message: 'Department archived.' };
  },

  // Expected Future Backend Endpoint: GET /api/admin/complaints
  getComplaints: async () => {
    await mockDelay();
    // return api.get('/admin/complaints');
    return MOCK_COMPLAINTS;
  },

  // Expected Future Backend Endpoint: PUT /api/admin/complaints/:id
  updateComplaint: async (id, updatePayload) => {
    await mockDelay(250);
    // return api.put(`/admin/complaints/${id}`, updatePayload);
    return {
      success: true,
      complaintId: id,
      ...updatePayload,
      message: 'Complaint status and remarks updated successfully!',
    };
  },

  // Expected Future Backend Endpoint: GET /api/admin/requests
  getRequests: async () => {
    await mockDelay();
    // return api.get('/admin/requests');
    return [
      ...MOCK_LEAVES.map(l => ({ ...l, requestCategory: 'Leave Request', requester: 'Alex Rivera (Student)' })),
      {
        id: "REQ-FAC-01",
        requestCategory: "Faculty Lab Upgrade Request",
        requester: "Dr. Sarah Jenkins (Faculty)",
        details: "Request for 10 Nvidia GPU workstations for the Advanced AI Computing Lab.",
        status: "Pending",
        appliedOn: "2026-09-24",
        remarks: "Forwarded to Campus Finance & Procurement Committee."
      }
    ];
  },

  // Expected Future Backend Endpoint: POST /api/admin/requests/:id/action
  actionRequest: async (id, action, remarks) => {
    await mockDelay(250);
    // return api.post(`/admin/requests/${id}/action`, { action, remarks });
    return {
      success: true,
      requestId: id,
      action,
      remarks,
      message: `Request marked as ${action}.`,
    };
  },

  // Expected Future Backend Endpoint: GET /api/admin/announcements
  getAnnouncements: async () => {
    await mockDelay(200);
    // return api.get('/admin/announcements');
    return MOCK_ANNOUNCEMENTS;
  },

  // Expected Future Backend Endpoint: POST /api/admin/announcements
  createAnnouncement: async (announcementData) => {
    await mockDelay(300);
    // return api.post('/admin/announcements', announcementData);
    const newAnnouncement = {
      id: `ANN-${Date.now()}`,
      ...announcementData,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    return { success: true, announcement: newAnnouncement, message: 'Campus announcement published successfully!' };
  },

  // Expected Future Backend Endpoint: DELETE /api/admin/announcements/:id
  deleteAnnouncement: async (id) => {
    await mockDelay(200);
    // return api.delete(`/admin/announcements/${id}`);
    return { success: true, id, message: 'Announcement archived successfully.' };
  },

  // Expected Future Backend Endpoint: GET /api/admin/events
  getEvents: async () => {
    await mockDelay(200);
    // return api.get('/admin/events');
    return MOCK_EVENTS;
  },

  // Expected Future Backend Endpoint: POST /api/admin/events
  createEvent: async (eventData) => {
    await mockDelay(300);
    // return api.post('/admin/events', eventData);
    const newEvent = {
      id: `EVT-${Date.now()}`,
      ...eventData,
      registered: false,
      registeredCount: 0,
    };
    return { success: true, event: newEvent, message: 'Campus event created successfully!' };
  },

  // Expected Future Backend Endpoint: DELETE /api/admin/events/:id
  deleteEvent: async (id) => {
    await mockDelay(200);
    // return api.delete(`/admin/events/${id}`);
    return { success: true, id, message: 'Campus event removed.' };
  }
};

export default adminService;
