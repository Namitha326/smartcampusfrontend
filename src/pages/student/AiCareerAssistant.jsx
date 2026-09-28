import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Sparkles,
  Target,
  Compass,
  Code2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Brain,
  Lightbulb,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const AiCareerAssistant = () => {
  const [loading, setLoading] = useState(true);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [careerAnalysis, setCareerAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [projects, setProjects] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const initCareerData = async () => {
      try {
        const skills = await aiService.getStudentSkills();
        setCurrentSkills(skills);
        await handleRoleChange(targetRole);
      } catch (err) {
        console.error('Error loading AI career assistant', err);
      } finally {
        setLoading(false);
      }
    };
    initCareerData();
  }, []);

  const handleRoleChange = async (newRole) => {
    setTargetRole(newRole);
    setAnalyzing(true);
    try {
      const [analysisRes, roadmapRes, projectsRes] = await Promise.all([
        aiService.analyzeCareer(newRole),
        aiService.getRoadmap(newRole),
        aiService.getProjects(newRole),
      ]);
      setCareerAnalysis(analysisRes);
      setRoadmap(roadmapRes);
      setProjects(projectsRes);
    } catch (err) {
      console.error('Error analyzing career', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner text="Consulting AI career models and curriculum paths..." />;

  const availableRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'AI/ML Engineer',
    'Cloud Engineer',
    'Data Analyst',
  ];

  return (
    <div className="space-y-6">
      {/* Hero AI Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
              Autonomous Skill-to-Career Intelligence Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Career Pathfinder & Upskilling Copilot
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Personalized skill gap evaluation, progressive milestone roadmaps, and targeted portfolio project recommendations.
            </p>
          </div>

          {/* Target Role Selector Dropdown */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col gap-2 min-w-[240px]">
            <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-300" />
              Target Career Track
            </label>
            <select
              value={targetRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-900/80 text-white border border-white/20 rounded-lg p-2.5 font-semibold focus:ring-2 focus:ring-amber-300 focus:outline-none"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {analyzing && <LoadingSpinner text="Running skill gap regression analysis..." />}

      {/* Main Grid: Current Skills vs Target Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Current Skills */}
        <Card
          title="Current Student Skills Profile"
          subtitle="Real-time academic & laboratory verified proficiencies"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            {currentSkills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{skill.name}</span>
                  <span className="text-indigo-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 2 & 3: Match Summary & Skill Gap Analysis */}
        <Card
          title={`Skill Gap Analysis: ${targetRole}`}
          subtitle="Comparison of your current skill level against industry entry requirements"
          className="lg:col-span-2"
        >
          {/* Match Score & Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-indigo-200/80 shadow-xs min-w-[100px]">
              <span className="text-3xl font-extrabold text-indigo-600">
                {careerAnalysis?.matchPercentage || 0}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Profile Match
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {careerAnalysis?.summary}
            </p>
          </div>

          {/* Skill Gap Comparison Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Skill Required</th>
                  <th className="py-2.5 px-4 text-center">Current</th>
                  <th className="py-2.5 px-4 text-center">Required Target</th>
                  <th className="py-2.5 px-4 text-center">Skill Gap</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {careerAnalysis?.requiredSkills.map((item) => {
                  const isReady = item.gap <= 10;
                  return (
                    <tr key={item.name} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-4 text-center font-medium text-slate-600">
                        {item.current}%
                      </td>
                      <td className="py-2.5 px-4 text-center font-medium text-slate-900">
                        {item.required}%
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            isReady
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          -{item.gap}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Badge variant={isReady ? 'completed' : 'pending'} size="sm">
                          {isReady ? 'Satisfied' : 'Upskilling Needed'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Section 4: Learning Roadmap */}
      <Card
        title={`Customized Learning Roadmap for ${targetRole}`}
        subtitle="Chronological sequence recommended by AI curriculum synthesizer"
      >
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
          {roadmap.map((step) => {
            const isCompleted = step.status === 'Completed';
            const isInProgress = step.status === 'In Progress';

            return (
              <div key={step.step} className="relative group">
                {/* Step Marker Circle */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isInProgress
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                </div>

                {/* Step Card Content */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 transition-all shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.duration}
                      </span>
                      <Badge variant={step.status} size="sm">
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 5: AI Project Recommendations */}
      <Card
        title="Recommended Portfolio Projects"
        subtitle="Build these projects to eliminate skill gaps and stand out during campus placements"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={proj.difficulty === 'Advanced' ? 'high' : 'technical'} size="sm">
                    {proj.difficulty}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Est. {proj.duration}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 leading-snug">
                  {proj.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {proj.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" className="w-full" icon={Code2}>
                  Start Project Guide
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AiCareerAssistant;
