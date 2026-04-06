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
    tenCongTy: '',
    moTa: '',
    website: '',
    diaChi: '',
    logoUrl: '',
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
          tenCongTy: data.tenCongTy || '',
          moTa: data.moTa || '',
          website: data.website || '',
          diaChi: data.diaChi || '',
          logoUrl: data.logoUrl || '',
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
    setTimeout(() => setToast(null), 4000);
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
      showToast('Đã tải lên logo thành công');
    } catch (err) {
      showToast(err.response?.data?.message || 'Tải lên thất bại', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tenCongTy.trim()) {
      showToast('Tên công ty là bắt buộc', 'error');
      return;
    }
    try {
      setSaving(true);
      await companyService.createOrUpdate(formData);
      showToast(company ? 'Đã cập nhật công ty' : 'Đã tạo công ty');
      setTimeout(() => navigate('/dashboard/recruiter'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Lưu thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  const statusColors = {
    'ĐƯỢC_DUYỆT': { bg: 'rgba(61, 139, 95, 0.12)', color: 'var(--success)', label: 'Đã duyệt' },
    'CHỜ_XỬ_LÝ': { bg: 'var(--tertiary-dim)', color: 'var(--warning)', label: 'Chờ duyệt' },
    'BỊ_TỪ_CHỐI': { bg: 'rgba(184, 64, 64, 0.1)', color: 'var(--error)', label: 'Từ chối' }
  };

  const currentStatus = statusColors[company?.trangThai] || statusColors['CHỜ_XỬ_LÝ'];

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 100,
          right: 24,
          zIndex: 1000,
          padding: '14px 24px',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          background: toast.type === 'error' ? 'var(--error)' : 'var(--success)',
          color: 'white',
          fontWeight: 600
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ background: 'var(--bg-dark)', paddingTop: 60, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -150,
          right: -50,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 32,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 500,
              padding: 0
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: formData.logoUrl ? 'transparent' : 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 700,
              color: formData.logoUrl ? 'transparent' : 'var(--accent)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              fontFamily: 'Playfair Display, serif'
            }}>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                formData.tenCongTy?.[0]?.toUpperCase() || 'C'
              )}
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: 4 }}>
                {company ? 'Chỉnh sửa công ty' : 'Tạo công ty'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                {company ? 'Cập nhật thông tin công ty của bạn' : 'Thiết lập hồ sơ công ty của bạn'}
              </p>
            </div>
          </div>
        </div>

        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          viewBox="0 0 1440 50"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M0 50V10C240 35 480 50 720 35C960 20 1200 0 1440 10V50H0Z" fill="var(--bg-primary)" />
        </svg>
      </div>

      <div className="container" style={{ padding: '48px 32px', maxWidth: 640 }}>
        {company && company.trangThai && (
          <div className="card" style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="22" height="22" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>Trạng thái công ty</p>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: currentStatus.bg,
                  color: currentStatus.color
                }}>
                  {currentStatus.label}
                </span>
              </div>
            </div>
            {company.trangThai === 'CHỜ_XỬ_LÝ' && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Đang chờ admin duyệt
              </p>
            )}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Logo công ty</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="btn btn-secondary"
                >
                  {uploadingLogo ? (
                    <>
                      <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Tải lên Logo
                    </>
                  )}
                </button>
                {formData.logoUrl && (
                  <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.88rem' }}>
                    ✓ Logo đã tải
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Tên công ty *</label>
              <input
                type="text"
                name="tenCongTy"
                value={formData.tenCongTy}
                onChange={handleChange}
                placeholder="Nhập tên công ty của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                rows={5}
                placeholder="Giới thiệu về công ty, văn hóa và điều gì khiến bạn trở nên đặc biệt..."
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://congty.com"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
              />
            </div>

            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.5 : 1 }}
              >
                {saving ? (
                  <>
                    <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                    Đang lưu...
                  </>
                ) : (
                  company ? 'Cập nhật công ty' : 'Tạo công ty'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
};

export default CompanyEditPage;
