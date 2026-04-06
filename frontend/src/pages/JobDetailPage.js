import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      setApplyError('Vui lòng tải lên file PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setApplyError('Dung lượng file phải nhỏ hơn 10MB');
      return;
    }

    try {
      setUploadingCV(true);
      setApplyError('');
      const res = await uploadService.uploadCV(file);
      setCvFile({ name: file.name, url: res.data.data.url });
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Tải lên thất bại');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleApply = async () => {
    if (!cvFile?.url) {
      setApplyError('Vui lòng tải lên CV trước');
      return;
    }

    try {
      setApplying(true);
      setApplyError('');
      await applicationService.apply({
        viecLamId: id,
        cvUrl: cvFile.url
      });
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Ứng tuyển thất bại');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!job) {
    return (
      <div style={{ padding: '100px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Không tìm thấy tin tuyển dụng</h2>
        <button onClick={() => navigate('/jobs')} className="btn btn-primary">
          ← Quay lại danh sách việc làm
        </button>
      </div>
    );
  }

  const statusColors = {
    'ĐANG_TUYỂN': 'active',
    'NHÁP': 'pending',
    'TẠM_DỪNG': 'pending',
    'ĐÃ_ĐÓNG': 'closed'
  };

  const statusLabels = {
    'ĐANG_TUYỂN': 'Đang tuyển',
    'NHÁP': 'Nháp',
    'TẠM_DỪNG': 'Tạm dừng',
    'ĐÃ_ĐÓNG': 'Đã đóng'
  };

  return (
    <div className="job-detail-page" style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ padding: '48px 32px' }}>
          <button
            onClick={() => navigate('/jobs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text-secondary)',
              marginBottom: 24,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              padding: 0,
              transition: 'color 0.2s'
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách việc làm
          </button>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div className="company-logo" style={{ width: 80, height: 80, fontSize: '2.2rem' }}>
              {job.tenCongTy?.[0] || 'C'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>{job.tieuDe}</h1>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{job.tenCongTy}</p>
                </div>
                <span className={`status ${statusColors[job.trangThai] || 'closed'}`}>
                  {statusLabels[job.trangThai] || job.trangThai}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="card">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Mô tả công việc</h2>
              <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {job.moTa}
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Yêu cầu</h2>
              <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {job.yeuCau}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ position: 'sticky', top: 100 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Thông tin tuyển dụng</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(job.mucLuong || job.mucLuongToiDa) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'rgba(61, 139, 95, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="20" height="20" fill="none" stroke="var(--success)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Lương</p>
                      <p style={{ fontWeight: 600 }}>{job.mucLuong ? `${Number(job.mucLuong).toLocaleString()} - ${job.mucLuongToiDa ? Number(job.mucLuongToiDa).toLocaleString() : ''}` : 'Thỏa thuận'}</p>
                    </div>
                  </div>
                )}

                {job.tenDanhMuc && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'var(--tertiary-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="20" height="20" fill="none" stroke="var(--tertiary)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Ngành nghề</p>
                      <p style={{ fontWeight: 600 }}>{job.tenDanhMuc}</p>
                    </div>
                  </div>
                )}

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
                    <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Ngày đăng</p>
                    <p style={{ fontWeight: 600 }}>{new Date(job.ngayTao).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {user?.vaiTro === 'UNG_VIEN' && job.trangThai === 'ĐANG_TUYỂN' && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 24, justifyContent: 'center' }}
                >
                  Ứng tuyển ngay
                </button>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 24, justifyContent: 'center' }}
                >
                  Đăng nhập để ứng tuyển
                </Link>
              )}

              {applySuccess && (
                <div className="success" style={{ marginTop: 16 }}>
                  Đơn ứng tuyển đã được gửi thành công!
                </div>
              )}
            </div>

            {job.tenCongTy && (
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Về công ty</h3>
                <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'center' }}>
                  <div className="logo" style={{ width: 52, height: 52, fontSize: '1.4rem', marginBottom: 0 }}>
                    {job.tenCongTy?.[0] || 'C'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{job.tenCongTy}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.trangThai}</p>
                  </div>
                </div>
                {job.moTaCongTy && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
                    {job.moTaCongTy}
                  </p>
                )}
                {job.website && (
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.92rem' }}
                  >
                    Truy cập website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              padding: 36,
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontSize: '1.4rem' }}>Ứng tuyển vị trí này</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 12, fontSize: '0.92rem' }}>
                Tải lên CV của bạn (PDF)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingCV}
                style={{
                  width: '100%',
                  padding: 24,
                  border: '2px dashed var(--border)',
                  borderRadius: 14,
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                  opacity: uploadingCV ? 0.5 : 1
                }}
              >
                {uploadingCV ? (
                  <>
                    <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {cvFile ? 'Đổi file' : 'Nhấn để tải CV'}
                  </>
                )}
              </button>
              {cvFile && (
                <p style={{ marginTop: 12, color: 'var(--success)', fontSize: '0.88rem', fontWeight: 600 }}>
                  ✓ {cvFile.name}
                </p>
              )}
            </div>

            {applyError && (
              <div className="error" style={{ marginBottom: 20 }}>{applyError}</div>
            )}

            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                disabled={applying || !cvFile}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: (!cvFile || applying) ? 0.5 : 1 }}
              >
                {applying ? (
                  <>
                    <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đơn ứng tuyển'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
