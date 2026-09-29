# SmartCampus AI - Frontend

> **AI-Powered Smart Campus Management & Student Support System**  
> Built as the Frontend component of a 3-tier system (Frontend, Backend, Database).

---

## 📌 Architecture & Team Role

- **Developer 1 (This Repository / Frontend)**: React 19, Vite, Tailwind CSS, Lucide React, Recharts.
- **Developer 2 (Backend)**: REST API services (Node.js/Express) connecting to `src/services/`.
- **Developer 3 (Database)**: Schemas and queries (MongoDB/Mongoose).

> ⚠️ **Strict Constraint Adherence**:  
> This frontend contains **NO server-side code**, **NO MongoDB/Mongoose models**, **NO hardcoded AI keys**, and **NO JWT verification logic**. All data interactions are abstracted through the `src/services/` layer with mock promises that seamlessly swap with backend REST endpoints.

---

## 🛠 Technology Stack

- **Framework**: React.js (v19) + Vite
- **Styling**: Tailwind CSS + Custom CSS Design System
- **Routing**: React Router DOM (v7) with Role-Based Protected Routes
- **HTTP Client**: Axios (configured with interceptors in `src/services/api.js`)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Attendance Trends, Performance Curves, Donut Distributions)

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SmartCampus AI
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 👥 Three Dedicated User Roles

The platform provides distinct dashboards and workflows for all 3 campus roles:

### 1. 🎓 Student Portal (`/student/*`)
- **Dashboard**: Stat cards, attendance gauge, weekly trends, internal mark averages, action items.
- **Student Profile**: Photo, reg number, department, bio, skills tags, GitHub/LinkedIn links, full edit form.
- **Attendance Page**: Circular gauge, present/absent counts, subject progress bars, and table.
- **Internal Marks**: Continuous internal evaluation scores (Internal 1, 2, Assignment, Total, Grade) with benchmark chart against class averages.
- **Assignments**: Subject filter, due dates, submission status (`Pending`, `Submitted`, `Late`, `Graded`), file upload UI mock, evaluation feedback.
- **Campus Events**: Hackathons, workshops, cultural fests, category filters, upcoming vs. past tabs, 1-click registration.
- **Leave Request**: Application modal (Medical, On-Duty, Casual), quota tracking, and review history.
- **Complaints / Grievances**: Ticket submission form with evidence upload UI, categories, priority, and admin resolution logs.
- **Lost & Found**: Community lost item recovery and found property turn-in registry with category filters and contact buttons.
- **Announcements**: Pinned notices, circular categories (Exam, Academic, Events), read/unread states, and detail modal.
- **AI Career Assistant**: Live skill bars, target career selector (Frontend, Backend, Full Stack, AI/ML, Cloud, Data Analyst), skill gap table, step-by-step roadmap, and portfolio project suggestions.
- **Campus AI Chatbot**: Floating 24/7 assistant with quick prompts, typing indicators, and campus knowledge base.

### 2. 👨‍🏫 Faculty Console (`/faculty/*`)
- **Faculty Dashboard**: Total assigned students, today's attendance rate, pending requests, active coursework, class distribution charts.
- **Faculty Profile**: Designation, department, courses handled, room, qualifications, and editable profile.
- **Attendance Management**: Filter by Department, Year, Section, Subject, Date; student list with toggle switches (`Present` / `Absent`), bulk mark all, and save action.
- **Marks Management**: Select subject, exam component (Int 1, Int 2, Assignment); validate bounds (0 to max marks), input marks, and publish.
- **Assignments Management**: Publish problem sets with deadlines and reference deliverables; grade submissions with score and feedback comments.
- **Student Requests**: Approve or reject on-duty leaves and medical excuses with advisor remarks.
- **Announcements**: Broadcast notices targeted to specific departments and student years.

### 3. 🛡️ Administrator Operations (`/admin/*`)
- **Admin Dashboard**: 7 key campus metrics, department distribution donut, monthly attendance stability curve, grievance category bar charts, and grade distribution.
- **Manage Students**: Search, filter by department, enroll new student modal, edit modal, delete confirmation dialog, and profile modal.
- **Manage Faculty**: Search, filter by department, appoint faculty modal, edit, delete confirmation dialog, and details view.
- **Manage Departments**: Add, edit, archive department divisions (IT, CSE, ECE, MECH, CIVIL) with student/faculty counts, labs, and budgets.
- **Complaints Management**: Filter by status and category, assign technician/officer, update status to `Resolved` / `In Progress`, and add resolution remarks.
- **Request Management**: Central authorization for student off-campus permissions and faculty equipment requests.
- **Campus Analytics**: Longitudinal attendance curves, retention metrics, and department corporate placement percentages.

---

## ⚡ Instant Role Switcher for Hackathon Demonstrations

In the top navbar, a **Demo Role Switcher** dropdown allows instant switching between **Student**, **Faculty**, and **Admin** personas without re-authenticating, making judging and live reviews effortless!

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── assets/               # Logos and static assets
│   ├── components/
│   │   ├── common/           # Button, Card, Badge, StatCard, Modal, ConfirmDialog, Toast, EmptyState, LoadingSpinner
│   │   ├── layout/           # Navbar, Sidebar, DashboardLayout
│   │   ├── charts/           # AttendanceChart, MarksChart, DeptDistributionChart, AdminTrendChart
│   │   ├── forms/            # FormInput, FormSelect, FormTextarea, FileUpload
│   │   └── chatbot/          # CampusChatbot (Floating assistant widget)
│   ├── pages/
│   │   ├── auth/             # Login, Register, ForgotPassword
│   │   ├── student/          # Dashboard, Profile, Attendance, Marks, Assignments, Events, Leave, Complaints, Lost&Found, Announcements, AI Career, Notifications, Settings
│   │   ├── faculty/          # Dashboard, Profile, Attendance, Marks, Assignments, Requests, Announcements
│   │   └── admin/            # Dashboard, Students, Faculty, Departments, Requests, Complaints, Announcements, Events, Analytics
│   ├── services/
│   │   ├── api.js            # Axios client with interceptors
│   │   ├── authService.js    # Login, register, logout mock handlers
│   │   ├── studentService.js # Student endpoints
│   │   ├── facultyService.js # Faculty endpoints
│   │   ├── adminService.js   # Admin endpoints
│   │   └── aiService.js      # AI Career Assistant & Chatbot endpoints
│   ├── context/
│   │   └── AuthContext.jsx   # Global Auth, User state, Notifications, and Toast dispatch
│   ├── hooks/                # useDebounce, useLocalStorage, useMediaQuery
│   ├── utils/                # formatters, validators, constants
│   ├── routes/
│   │   └── AppRoutes.jsx     # Role-based protected routes & 404
│   ├── data/
│   │   └── mockData.js       # Comprehensive realistic campus mock database
│   ├── App.jsx               # Application root
│   ├── index.css             # Tailwind CSS directives & custom design system
│   └── main.jsx              # React DOM entry point
├── .env.example              # Environment variables template
├── tailwind.config.js        # Tailwind theme colors, fonts, and shadows
├── package.json
└── README.md
```

---

## 🔌 Backend Developer Integration Guide

All REST API calls are centralized in `src/services/`:

| Service Function | Target Future REST Endpoint | Method |
|---|---|---|
| `authService.login` | `/api/auth/login` | `POST` |
| `authService.register` | `/api/auth/register` | `POST` |
| `studentService.getProfile` | `/api/students/profile` | `GET` |
| `studentService.updateProfile` | `/api/students/profile` | `PUT` |
| `studentService.getAttendance` | `/api/students/attendance` | `GET` |
| `studentService.getMarks` | `/api/students/marks` | `GET` |
| `studentService.getAssignments`| `/api/students/assignments` | `GET` |
| `studentService.submitAssignment` | `/api/students/assignments/:id/submit` | `POST` |
| `studentService.getEvents` | `/api/events` | `GET` |
| `studentService.applyLeave` | `/api/leave` | `POST` |
| `studentService.getComplaints` | `/api/complaints` | `GET` |
| `studentService.submitComplaint` | `/api/complaints` | `POST` |
| `facultyService.saveAttendance` | `/api/faculty/attendance` | `POST` |
| `facultyService.saveMarks` | `/api/faculty/marks` | `POST` |
| `facultyService.createAssignment` | `/api/faculty/assignments` | `POST` |
| `adminService.createAnnouncement` | `/api/admin/announcements` | `POST` |
| `adminService.createEvent` | `/api/admin/events` | `POST` |
| `aiService.analyzeCareer` | `/api/ai/analyze` | `POST` |
| `aiService.getRoadmap` | `/api/ai/roadmap` | `POST` |
| `aiService.getProjects` | `/api/ai/projects` | `POST` |
| `aiService.sendChatQuery` | `/api/ai/chat` | `POST` |

Simply replace the mock return objects with `api.get(...)` / `api.post(...)` inside `src/services/*.js`. No component code changes are required!

---

## 🌿 Git Branch

This frontend is isolated on branch:
```bash
frontend-dev
```
Do not push or merge directly into `main`.
