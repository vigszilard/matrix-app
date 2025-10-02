'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createInterviewUrl } from '../lib/utils';

interface ActiveSession {
  id: string;
  candidateName: string;
  interviewer1: string;
  interviewer2: string;
  specialization: string | null;
  automationTools: string[];
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    candidateName: '',
    interviewer1: '',
    interviewer2: ''
  });
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/active-sessions');
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const sessions = await response.json();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
      setError('Unable to connect to server. Please make sure the Socket.IO server is running on port 3001.');
      setActiveSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Terminate a session
  const terminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/terminate-session/${sessionId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchActiveSessions(); // Refresh the list
        alert('Session terminated successfully');
      } else {
        alert('Failed to terminate session');
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
      alert('Failed to terminate session');
    }
  };

  // Join a session
  const joinSession = (session: ActiveSession) => {
    const url = createInterviewUrl(
      session.candidateName,
      session.interviewer1,
      session.interviewer2,
      session.id
    );
    router.push(url);
  };

  // Format specialization
  const formatSpecialization = (session: ActiveSession) => {
    if (!session.specialization) return 'Not started';
    if (session.specialization === 'manual') return 'Manual Testing';
    if (session.specialization === 'automation') {
      const tools = session.automationTools.length > 0 
        ? session.automationTools.join(', ')
        : 'No tools selected';
      return `Automation (${tools})`;
    }
    return session.specialization;
  };

  useEffect(() => {
    fetchActiveSessions();
    // Refresh sessions every 30 seconds
    const interval = setInterval(fetchActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidateName || !formData.interviewer1 || !formData.interviewer2) {
      alert('Please fill in all fields');
      return;
    }

    const url = createInterviewUrl(
      formData.candidateName,
      formData.interviewer1,
      formData.interviewer2
    );
    
    router.push(url);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Technical Interview Feedback
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage interview sessions and provide collaborative feedback
          </p>
        </div>

        {/* Active Sessions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              {showNewForm ? 'Cancel' : 'Start New Interview'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading sessions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 rounded-lg shadow border border-red-200">
              <div className="text-red-600 text-lg font-medium mb-2">Connection Error</div>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchActiveSessions}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Retry Connection
              </button>
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No active sessions</p>
              <p className="text-gray-400 text-sm mt-1">Start a new interview to begin</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.candidateName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium text-blue-700">Interviewer 1:</span> {session.interviewer1}</p>
                      <p><span className="font-medium text-green-700">Interviewer 2:</span> {session.interviewer2}</p>
                      <p><span className="font-medium">Status:</span> {formatSpecialization(session)}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => joinSession(session)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded text-sm"
                    >
                      Join Session
                    </button>
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded text-sm"
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Interview Form */}
        {showNewForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Start New Interview</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">
                    Candidate Name
                  </label>
                  <input
                    id="candidateName"
                    name="candidateName"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter candidate name"
                    value={formData.candidateName}
                    onChange={(e) => handleInputChange('candidateName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="interviewer1" className="block text-sm font-medium text-gray-700">
                    Interviewer 1
                  </label>
                  <input
                    id="interviewer1"
                    name="interviewer1"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter interviewer 1 name"
                    value={formData.interviewer1}
                    onChange={(e) => handleInputChange('interviewer1', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="interviewer2" className="block text-sm font-medium text-gray-700">
                    Interviewer 2
                  </label>
                  <input
                    id="interviewer2"
                    name="interviewer2"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter interviewer 2 name"
                    value={formData.interviewer2}
                    onChange={(e) => handleInputChange('interviewer2', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Start Interview
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
