'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseInterviewParams, calculateAverage } from '../../lib/utils';
import { InterviewData, SkillScore, CategoryComment } from '../../types';
import { categories, skills } from '../../data/skills';
import { useInterviewSync } from '../../hooks/useSocket';
import { PDFExport } from '../../components/PDFExport';
import { SkillTooltip } from '../../components/SkillTooltip';

function CompetencePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id, candidateName, interviewer1, interviewer2 } = parseInterviewParams(searchParams);
  
  const initialData: InterviewData = useMemo(() => ({
    id,
    candidateName,
    interviewer1,
    interviewer2,
    specialization: null,
    automationTools: [],
    skills: [],
    comments: []
  }), [id, candidateName, interviewer1, interviewer2]);

  const {
    interviewData,
    isConnected,
    sessionTerminated,
    updateSpecialization,
    updateAutomationTools,
    updateSkillScore,
    updateComment
  } = useInterviewSync(id, initialData);


  const [selectedSkills, setSelectedSkills] = useState<typeof skills>([]);

  // Initialize skills when specialization changes
  useEffect(() => {
    if (interviewData.specialization) {
      const applicableSkills = skills.filter(skill => {
        if (interviewData.specialization === 'manual') {
          return skill.applicableTo.includes('manual');
        } else if (interviewData.specialization === 'automation') {
          return interviewData.automationTools.some(tool => skill.applicableTo.includes(tool));
        }
        return false;
      });

      setSelectedSkills(applicableSkills);
    }
  }, [interviewData.specialization, interviewData.automationTools]);

  const handleSpecializationChange = (specialization: 'manual' | 'automation') => {
    updateSpecialization(specialization);
  };

  const handleAutomationToolChange = (tool: 'selenium' | 'cypress' | 'playwright', checked: boolean) => {
    const newTools = checked 
      ? [...interviewData.automationTools, tool]
      : interviewData.automationTools.filter(t => t !== tool);
    updateAutomationTools(newTools);
  };

  const handleScoreChange = (skillId: string, interviewer: 'interviewer1' | 'interviewer2', score: number | null) => {
    updateSkillScore(skillId, interviewer, score);
  };

  const handleCommentChange = (categoryId: string, interviewer: 'interviewer1' | 'interviewer2', comment: string) => {
    updateComment(categoryId, interviewer, comment);
  };

  // Auto-redirect when session is terminated
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  useEffect(() => {
    if (sessionTerminated) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [sessionTerminated, router]);

  // Countdown timer
  useEffect(() => {
    if (sessionTerminated && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [sessionTerminated, redirectCountdown]);

  const getSkillsForCategory = (categoryId: string) => {
    return selectedSkills.filter(skill => skill.category === categoryId);
  };

  const getCategoryAverage = (categoryId: string, interviewer: 'interviewer1' | 'interviewer2') => {
    const categorySkills = getSkillsForCategory(categoryId);
    const scores = categorySkills.map(skill => {
      const skillData = interviewData.skills.find(s => s.skillId === skill.id);
      return skillData ? skillData[`${interviewer}Score`] : null;
    });
    return calculateAverage(scores);
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return 'N/A';
    return score.toString();
  };

  return (
    <PDFExport interviewData={interviewData}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Technical Interview Feedback</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
              >
                ← Back to Homepage
              </button>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Candidate</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">{candidateName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Interviewer 1</label>
              <p className="mt-1 text-lg font-semibold text-blue-900">{interviewer1}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Interviewer 2</label>
              <p className="mt-1 text-lg font-semibold text-green-900">{interviewer2}</p>
            </div>
          </div>
        </div>

        {/* Session Terminated Notification */}
        {sessionTerminated && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Session Terminated
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>This interview session has been terminated. You will be redirected to the homepage in {redirectCountdown} seconds.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push('/')}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Specialization */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Main Specialization</h2>
          <div className="space-y-4">
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-900 font-medium">
                <input
                  type="radio"
                  name="specialization"
                  value="manual"
                  checked={interviewData.specialization === 'manual'}
                  onChange={() => handleSpecializationChange('manual')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                Manual Testing
              </label>
              <label className="flex items-center text-gray-900 font-medium">
                <input
                  type="radio"
                  name="specialization"
                  value="automation"
                  checked={interviewData.specialization === 'automation'}
                  onChange={() => handleSpecializationChange('automation')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                Automation Testing
              </label>
            </div>

            {/* Automation Tools */}
            {interviewData.specialization === 'automation' && (
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Automation Tools</h3>
                <div className="space-y-2">
                  {['selenium', 'cypress', 'playwright'].map(tool => (
                    <label key={tool} className="flex items-center text-gray-900 font-medium">
                      <input
                        type="checkbox"
                        checked={interviewData.automationTools.includes(tool as any)}
                        onChange={(e) => handleAutomationToolChange(tool as any, e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      {tool.charAt(0).toUpperCase() + tool.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills Categories */}
        {interviewData.specialization && (
          <div className="space-y-6">
            {categories
              .filter(cat => {
                if (interviewData.specialization === 'manual') {
                  return cat.applicableTo.includes('manual');
                } else if (interviewData.specialization === 'automation') {
                  return interviewData.automationTools.some(tool => cat.applicableTo.includes(tool));
                }
                return false;
              })
              .map(category => {
                const categorySkills = getSkillsForCategory(category.id);
                const avg1 = getCategoryAverage(category.id, 'interviewer1');
                const avg2 = getCategoryAverage(category.id, 'interviewer2');
                const categoryComment = interviewData.comments.find(c => c.categoryId === category.id);

                return (
                  <div key={category.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                    
                    {/* Skills */}
                    <div className="space-y-4 mb-6">
                      {categorySkills.map(skill => {
                        const skillData = interviewData.skills.find(s => s.skillId === skill.id);
                        return (
                          <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <SkillTooltip skillName={skill.name} description={skill.description}>
                              <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                {skill.name}
                              </span>
                            </SkillTooltip>
                            <div className="flex space-x-6">
                              {/* Interviewer 1 Score */}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-blue-700 font-medium">{interviewer1}:</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={skillData?.interviewer1Score ?? 0}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      handleScoreChange(
                                        skill.id, 
                                        'interviewer1', 
                                        value === 0 ? null : value
                                      );
                                    }}
                                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((skillData?.interviewer1Score ?? 0) / 4) * 100}%, #e5e7eb ${((skillData?.interviewer1Score ?? 0) / 4) * 100}%, #e5e7eb 100%)`
                                    }}
                                  />
                                  <span className="text-sm font-medium text-blue-900 min-w-[30px]">
                                    {skillData?.interviewer1Score === null ? 'N/A' : skillData?.interviewer1Score}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Interviewer 2 Score */}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-green-700 font-medium">{interviewer2}:</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={skillData?.interviewer2Score ?? 0}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      handleScoreChange(
                                        skill.id, 
                                        'interviewer2', 
                                        value === 0 ? null : value
                                      );
                                    }}
                                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((skillData?.interviewer2Score ?? 0) / 4) * 100}%, #e5e7eb ${((skillData?.interviewer2Score ?? 0) / 4) * 100}%, #e5e7eb 100%)`
                                    }}
                                  />
                                  <span className="text-sm font-medium text-green-900 min-w-[30px]">
                                    {skillData?.interviewer2Score === null ? 'N/A' : skillData?.interviewer2Score}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Category Average */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Category Average</h4>
                      <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-700 font-medium">{interviewer1}:</span>
                          <span className="font-semibold text-blue-900">
                            {avg1 !== null ? avg1.toFixed(2) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-700 font-medium">{interviewer2}:</span>
                          <span className="font-semibold text-green-900">
                            {avg2 !== null ? avg2.toFixed(2) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Comments</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            {interviewer1} Comments
                          </label>
                          <textarea
                            value={categoryComment?.interviewer1Comment || ''}
                            onChange={(e) => handleCommentChange(category.id, 'interviewer1', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder="Enter comments..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">
                            {interviewer2} Comments
                          </label>
                          <textarea
                            value={categoryComment?.interviewer2Comment || ''}
                            onChange={(e) => handleCommentChange(category.id, 'interviewer2', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            rows={3}
                            placeholder="Enter comments..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        </div>
      </div>
    </PDFExport>
  );
}

export default function CompetencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading interview session...</p>
        </div>
      </div>
    }>
      <CompetencePageContent />
    </Suspense>
  );
}
