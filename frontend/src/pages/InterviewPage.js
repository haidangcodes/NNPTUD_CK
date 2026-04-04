import React, { useState, useEffect } from 'react';
import { interviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InterviewPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const res = await interviewService.getMyInterviews();
      setInterviews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateInterview = async (id, data) => {
    try {
      await interviewService.update(id, data);
      showToast('Interview updated successfully');
      loadInterviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Cancel this interview?')) return;
    try {
      await interviewService.delete(id);
      showToast('Interview cancelled');
      loadInterviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const now = new Date();
  const upcomingInterviews = interviews.filter(i => new Date(i.interviewDate) > now);
  const pastInterviews = interviews.filter(i => new Date(i.interviewDate) <= now);

  const displayedInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700'
  };

  const isRecruiter = user?.role === 'RECRUITER';
  const isAdmin = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="interview-page min-h-screen bg-stone-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Interviews</h1>
              <p className="text-stone-500 mt-1">
                {isRecruiter || isAdmin ? 'Manage candidate interviews' : 'Your scheduled interviews'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-stone-800">{user?.email}</p>
                <p className="text-sm text-stone-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'upcoming'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Upcoming ({upcomingInterviews.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'past'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Past ({pastInterviews.length})
          </button>
        </div>

        {displayedInterviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No {activeTab} interviews</h3>
            <p className="text-stone-500">
              {isRecruiter || isAdmin
                ? 'Schedule interviews with candidates to see them here'
                : 'You have no scheduled interviews'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedInterviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">
                          {new Date(interview.interviewDate).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-stone-500">
                          {new Date(interview.interviewDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {interview.applicationId && (
                      <div className="ml-13 pl-13">
                        <p className="text-stone-600">
                          <span className="text-stone-400">Candidate:</span>{' '}
                          {interview.applicationId.candidateId?.email || 'N/A'}
                        </p>
                        <p className="text-stone-600">
                          <span className="text-stone-400">Job:</span>{' '}
                          {interview.applicationId.jobId?.title || 'N/A'}
                        </p>
                      </div>
                    )}

                    {interview.notes && (
                      <p className="text-sm text-stone-500 mt-2 italic">"{interview.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                      >
                        Join Meeting
                      </a>
                    )}
                    {(isRecruiter || isAdmin) && (
                      <>
                        <button
                          onClick={() => handleDeleteInterview(interview._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
