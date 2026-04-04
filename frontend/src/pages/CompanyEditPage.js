import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService, uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    address: '',
    logoUrl: ''
  });

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const res = await companyService.getMyCompany();
      const data = res.data.data;
      setCompany(data);
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          website: data.website || '',
          address: data.address || '',
          logoUrl: data.logoUrl || ''
        });
      }
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const res = await uploadService.uploadImage(file);
      setFormData({ ...formData, logoUrl: res.data.data.imageUrl });
      showToast('Logo uploaded successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Company name is required', 'error');
      return;
    }
    try {
      setSaving(true);
      await companyService.createOrUpdate(formData);
      showToast(company ? 'Company updated successfully' : 'Company created successfully');
      setTimeout(() => navigate('/dashboard/recruiter'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusColors = {
    APPROVED: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="company-edit-page min-h-screen bg-stone-50">
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
          className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
            <div className="flex items-center gap-4">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt={formData.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-white/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white">
                  {formData.name?.[0]?.toUpperCase() || 'C'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {company ? 'Edit Company' : 'Create Company'}
                </h1>
                <p className="text-white/80">
                  {company ? 'Update your company information' : 'Set up your company profile'}
                </p>
              </div>
            </div>
          </div>

          {company && company.status && (
            <div className="px-8 py-3 bg-stone-50 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[company.status]}`}>
                  {company.status}
                </span>
                {company.status === 'PENDING' && (
                  <span className="text-sm text-stone-400">(Awaiting admin approval)</span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700">Company Logo</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="px-5 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingLogo ? (
                    <>
                      <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Logo
                    </>
                  )}
                </button>
                {formData.logoUrl && (
                  <span className="text-sm text-emerald-600">Logo uploaded</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your company..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-stone-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Company address"
              />
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-medium shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  company ? 'Update Company' : 'Create Company'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
