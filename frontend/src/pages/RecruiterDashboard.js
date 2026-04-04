import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService, companyService, applicationService, interviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryRange: '',
    categoryId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, companyRes] = await Promise.all([
        jobService.getMyJobs(),
        companyService.getMyCompany()
      ]);
      setMyJobs(jobsRes.data.data || []);
      setCompany(companyRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.create(jobForm);
      setShowJobForm(false);
      setJobForm({ title: '', description: '', requirements: '', salaryRange: '', categoryId: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Xóa việc làm này?')) return;
    try {
      await jobService.delete(id);
      setMyJobs(myJobs.filter(j => j._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const viewApplications = async (jobId) => {
    try {
      const res = await applicationService.getByJob(jobId);
      setJobApplications(res.data.data || []);
      setSelectedJobApps(jobId);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Recruiter Dashboard</h1>
              <p className="text-stone-500 mt-1">Welcome, {user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard/interviews"
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                View Interviews
              </Link>
              <Link
                to="/company/edit"
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/25"
              >
                {company ? 'Edit Company' : 'Create Company'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {company && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                {company.name?.[0] || 'C'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{company.name}</h2>
                <p className="text-white/80 text-sm">{company.address || 'No address'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                company.status === 'APPROVED' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
              }`}>
                {company.status}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'jobs'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            My Jobs ({myJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'create'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Post New Job
          </button>
        </div>

        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-stone-800 mb-6">Post a New Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Senior React Developer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Describe the role..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Requirements *</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="List requirements..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. $5000 - $8000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category ID</label>
                  <input
                    type="text"
                    value={jobForm.categoryId}
                    onChange={(e) => setJobForm({ ...jobForm, categoryId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="MongoDB ObjectId"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="px-6 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/25"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {myJobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-700 mb-2">No jobs posted yet</h3>
                <p className="text-stone-500 mb-4">Post your first job to start receiving applications</p>
                <button onClick={() => setActiveTab('create')} className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Post a Job →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Job Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-stone-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myJobs.map(job => (
                    <tr key={job._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${job._id}`} className="font-medium text-stone-800 hover:text-emerald-600">
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-sm">
                        {job.categoryId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                          job.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => viewApplications(job._id)}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium mr-3"
                        >
                          View Apps
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {selectedJobApps && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-800">Applications</h3>
                <button onClick={() => setSelectedJobApps(null)} className="text-stone-400 hover:text-stone-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                {jobApplications.length === 0 ? (
                  <p className="text-center text-stone-500">No applications yet</p>
                ) : (
                  <div className="space-y-4">
                    {jobApplications.map(app => (
                      <div key={app._id} className="border border-stone-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-stone-800">{app.candidateId?.email || 'N/A'}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">Applied: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</p>
                        {app.cvUrl && (
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-2 inline-block">
                            View CV
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
