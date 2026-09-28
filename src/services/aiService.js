import api from './api';
import {
  MOCK_AI_CAREER_DATA,
  MOCK_CHATBOT_KNOWLEDGE,
} from '../data/mockData';

const mockDelay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  // Expected Future Backend Endpoint: GET /api/ai/skills
  getStudentSkills: async () => {
    await mockDelay(200);
    // return api.get('/ai/skills');
    return MOCK_AI_CAREER_DATA.currentStudentSkills;
  },

  // Expected Future Backend Endpoint: POST /api/ai/analyze
  analyzeCareer: async (targetRole) => {
    await mockDelay(400);
    // return api.post('/ai/analyze', { targetRole });
    const track = MOCK_AI_CAREER_DATA.careerTracks[targetRole] || MOCK_AI_CAREER_DATA.careerTracks["Full Stack Developer"];
    return {
      role: targetRole,
      matchPercentage: track.matchPercentage,
      summary: track.summary,
      requiredSkills: track.requiredSkills,
    };
  },

  // Expected Future Backend Endpoint: POST /api/ai/roadmap
  getRoadmap: async (targetRole) => {
    await mockDelay(350);
    // return api.post('/ai/roadmap', { targetRole });
    const track = MOCK_AI_CAREER_DATA.careerTracks[targetRole] || MOCK_AI_CAREER_DATA.careerTracks["Full Stack Developer"];
    return track.roadmap;
  },

  // Expected Future Backend Endpoint: POST /api/ai/projects
  getProjects: async (targetRole) => {
    await mockDelay(350);
    // return api.post('/ai/projects', { targetRole });
    const track = MOCK_AI_CAREER_DATA.careerTracks[targetRole] || MOCK_AI_CAREER_DATA.careerTracks["Full Stack Developer"];
    return track.recommendedProjects;
  },

  // Expected Future Backend Endpoint: POST /api/ai/chat
  sendChatQuery: async (userMessage) => {
    await mockDelay(500); // realistic AI thinking simulation
    // return api.post('/ai/chat', { message: userMessage });

    const lower = userMessage.toLowerCase();
    let reply = MOCK_CHATBOT_KNOWLEDGE.default;

    if (lower.includes('leave') || lower.includes('sick') || lower.includes('od') || lower.includes('vacation')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.leave;
    } else if (lower.includes('attendance') || lower.includes('present') || lower.includes('absent')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.attendance;
    } else if (lower.includes('assignment') || lower.includes('homework') || lower.includes('submit')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.assignment;
    } else if (lower.includes('exam') || lower.includes('announcement') || lower.includes('schedule') || lower.includes('timetable')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.exam;
    } else if (lower.includes('dept') || lower.includes('department') || lower.includes('contact') || lower.includes('office')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.department;
    } else if (lower.includes('mark') || lower.includes('grade') || lower.includes('score')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.marks;
    } else if (lower.includes('complaint') || lower.includes('grievance') || lower.includes('broken') || lower.includes('wifi')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.complaint;
    } else if (lower.includes('career') || lower.includes('job') || lower.includes('skill') || lower.includes('roadmap')) {
      reply = MOCK_CHATBOT_KNOWLEDGE.career;
    }

    return {
      success: true,
      reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
};

export default aiService;
