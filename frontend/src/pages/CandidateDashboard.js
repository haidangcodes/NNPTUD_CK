import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService, profileService, interviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appRes, profileRes, interviewRes] = await Promise.all([
        applicationService.getMyApplications(),
        profileService.getMe(),
        interviewService.getMyInterviews()
      ]);
      setApplications(appRes.data.data || []);
      setProfile(profileRes.data.data);
      setInterviews(interviewRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (id) => {
    try {
      await applicationService.delete(id);
      setApplications(applications.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    APPLIED: 'bg-blue-100 text-blue-700',
    REVIEWING: 'bg-amber-100 text-amber-700',
    SHORTLISTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  const upcomingInterviews = interviews.filter(i => new Date(i.interviewDate) > new Date());

  return (
    <div className="dashboard min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Candidate Dashboard</h1>
              <p className="text-stone-500 mt-1">Welcome back, {user?.email}</p>
            </div>
            <Link
              to="/profile/edit"
              className="px-5 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium shadow-lg shadow-amber-500/25"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'applications'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'interviews'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Interviews ({upcomingInterviews.length})
          </button>
        </div>

        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-700 mb-2">No applications yet</h3>
                <p className="text-stone-500 mb-4">Start applying to jobs to see them here</p>
                <Link to="/jobs" className="text-amber-600 hover:text-amber-700 font-medium">Browse Jobs</Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Job</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Applied Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-stone-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {applications.map(app => (
                    <tr key={app._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${app.jobId?._id}`} className="font-medium text-stone-800 hover:text-amber-600">
                          {app.jobId?.title || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-sm">
                        {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-stone-100 text-stone-600'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCancelApplication(app._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="space-y-4">
            {upcomingInterviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-700 mb-2">No upcoming interviews</h3>
                <p className="text-stone-500">When employers schedule interviews, they'll appear here</p>
              </div>
            ) : (
              upcomingInterviews.map(interview => (
                <div key={interview._id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-800">
                        {new Date(interview.interviewDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-stone-500 text-sm">
                        {new Date(interview.interviewDate).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {interview.applicationId?.jobId?.title && (
                        <p className="text-stone-600 mt-2">Position: {interview.applicationId.jobId.title}</p>
                      )}
                      {interview.notes && (
                        <p className="text-stone-500 text-sm mt-2 italic">"{interview.notes}"</p>
                      )}
                    </div>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
