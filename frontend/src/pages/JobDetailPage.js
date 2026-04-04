import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService, uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const res = await jobService.getById(id);
      setJob(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setApplyError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setApplyError('File size must be less than 10MB');
      return;
    }

    try {
      setUploadingCV(true);
      setApplyError('');
      const res = await uploadService.uploadCV(file);
      setCvFile({ name: file.name, url: res.data.data.cvUrl });
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to upload CV');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleApply = async () => {
    if (!cvFile?.url) {
      setApplyError('Please upload your CV first');
      return;
    }

    try {
      setApplying(true);
      setApplyError('');
      await applicationService.apply({
        jobId: id,
        cvUrl: cvFile.url
      });
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-700 mb-4">Job not found</h2>
          <button onClick={() => navigate('/jobs')} className="text-amber-600 hover:text-amber-700">← Back to jobs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => navigate('/jobs')} className="text-stone-500 hover:text-amber-600 transition-colors flex items-center gap-2 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to jobs
          </button>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400 flex-shrink-0">
              {job.companyId?.name?.[0] || 'C'}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-stone-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-stone-600">{job.companyId?.name}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  job.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                  job.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Job Description</h2>
              <div className="prose prose-stone max-w-none text-stone-600 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Requirements</h2>
              <div className="prose prose-stone max-w-none text-stone-600 whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-6">
              <h3 className="font-bold text-stone-900 mb-4">Job Details</h3>
              <div className="space-y-4">
                {job.salaryRange && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase">Salary</p>
                      <p className="font-medium text-stone-800">{job.salaryRange}</p>
                    </div>
                  </div>
                )}

                {job.categoryId?.name && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase">Category</p>
                      <p className="font-medium text-stone-800">{job.categoryId.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase">Posted</p>
                    <p className="font-medium text-stone-800">
                      {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === 'CANDIDATE' && job.status === 'ACTIVE' && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/25"
                >
                  Apply Now
                </button>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/25"
                >
                  Login to Apply
                </button>
              )}

              {applySuccess && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-emerald-700 font-medium text-center">Application submitted!</p>
                </div>
              )}
            </div>

            {job.companyId && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-stone-900 mb-4">About Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-400">
                    {job.companyId.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{job.companyId.name}</p>
                    <p className="text-sm text-stone-500">{job.companyId.status}</p>
                  </div>
                </div>
                {job.companyId.description && (
                  <p className="text-sm text-stone-600 mb-4">{job.companyId.description}</p>
                )}
                {job.companyId.website && (
                  <a href={job.companyId.website} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                    Visit website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-900">Apply for this job</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-stone-400 hover:text-stone-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Upload your CV (PDF only)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploadingCV ? (
                    <>
                      <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {cvFile ? 'Change file' : 'Click to upload CV'}
                    </>
                  )}
                </button>
                {cvFile && (
                  <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {cvFile.name}
                  </p>
                )}
              </div>

              {applyError && (
                <p className="text-red-500 text-sm">{applyError}</p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying || !cvFile}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Applying...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
