import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    skills: '',
    cvUrl: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileService.getMe();
      const data = res.data.data;
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        address: data.address || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
        cvUrl: data.cvUrl || ''
      });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCV(true);
      const res = await uploadService.uploadCV(file);
      setFormData({ ...formData, cvUrl: res.data.data.cvUrl });
      showToast('CV uploaded successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await profileService.updateMe(data);
      showToast('Profile updated successfully');
      setTimeout(() => navigate('/dashboard/candidate'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="profile-edit-page min-h-screen bg-stone-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white">
                {formData.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="+84 xxx xxx xxx"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Your address"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="JavaScript, React, Node.js (comma separated)"
              />
              <p className="text-xs text-stone-400 mt-1">Separate skills with commas</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700">CV / Resume</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCVUpload}
                  accept=".pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="px-5 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingCV ? (
                    <>
                      <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload CV
                    </>
                  )}
                </button>
                {formData.cvUrl && (
                  <a
                    href={formData.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View current CV
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
