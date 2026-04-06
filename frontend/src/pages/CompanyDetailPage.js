import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { companyService, jobService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [companyRes] = await Promise.all([companyService.getById(id)]);
      setCompany(companyRes.data.data);

      try {
        const jobsRes = await jobService.getAll({ congTyId: id });
        setJobs(jobsRes.data.data.vieclam || jobsRes.data.data.viecLams || []);
      } catch (err) {
        console.error('Error loading jobs:', err);
      }
    } catch (err) {
      console.error(err);
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await companyService.approve(id);
      showToast('Duyệt công ty thành công');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Duyệt thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await companyService.reject(id);
      showToast('Từ chối công ty');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!company) {
    return (
      <div style={{ padding: '100px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Không tìm thấy công ty</h2>
        <Link to="/companies" className="btn btn-primary">Quay lại danh sách công ty</Link>
      </div>
    );
  }

  const statusConfig = {
    'ĐƯỢC_DUYỆT': { bg: 'rgba(61, 139, 95, 0.12)', color: 'var(--success)', label: 'Đã duyệt' },
    'CHỜ_XỬ_LÝ': { bg: 'var(--tertiary-dim)', color: 'var(--warning)', label: 'Chờ duyệt' },
    'BỊ_TỪ_CHỐI': { bg: 'rgba(184, 64, 64, 0.1)', color: 'var(--error)', label: 'Từ chối' },
    'BỊ_KHÓA': { bg: 'rgba(184, 64, 64, 0.1)', color: 'var(--error)', label: 'Bị khóa' }
  };

  const status = statusConfig[company.trangThai] || statusConfig['CHỜ_XỬ_LÝ'];
  const isAdmin = user?.vaiTro === 'QUAN_TRI';

  return (
    <div style={{ paddingBottom: 80 }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 100,
            right: 24,
            zIndex: 1000,
            padding: '16px 24px',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: toast.type === 'error' ? 'var(--error)' : 'var(--success)',
            color: 'white',
            fontWeight: 600,
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {toast.type === 'error' ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      <div style={{ background: 'var(--bg-dark)', paddingTop: 80, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -200,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/companies')}
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
            Tất cả công ty
          </button>

          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--border) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--accent)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'Playfair Display, serif',
              flexShrink: 0
            }}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.tenCongTy} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24 }} />
              ) : (
                company.tenCongTy?.[0] || 'C'
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', letterSpacing: '-0.02em' }}>
                  {company.tenCongTy}
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 24,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    background: status.bg,
                    color: status.color
                  }}
                >
                  {status.label}
                </span>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--accent)',
                    marginBottom: 16,
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {company.website}
                </a>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {company.diaChi || 'Chưa cập nhật địa chỉ'}
              </div>
            </div>
          </div>
        </div>

        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M0 60V20C240 50 480 60 720 40C960 20 1200 0 1440 20V60H0Z" fill="var(--bg-primary)" />
        </svg>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="card">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Giới thiệu công ty</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {company.moTa || 'Chưa có mô tả cho công ty này.'}
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.3rem' }}>Tin tuyển dụng</h2>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)'
                }}>
                  {jobs.length} tin
                </span>
              </div>

              {jobs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      style={{
                        display: 'block',
                        padding: 20,
                        borderRadius: 14,
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        transition: 'all 0.25s ease',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: 6, fontWeight: 700 }}>{job.tieuDe}</h3>
                          <div style={{ display: 'flex', gap: 16, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            {(job.mucLuong || job.mucLuongToiDa) && <span>{job.mucLuong ? `${Number(job.mucLuong).toLocaleString()} - ${job.mucLuongToiDa ? Number(job.mucLuongToiDa).toLocaleString() : ''}` : 'Thỏa thuận'}</span>}
                            <span className={`status ${job.trangThai?.toLowerCase()}`}>{job.trangThai}</span>
                          </div>
                        </div>
                        <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" style={{ opacity: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <p>Hiện chưa có tin tuyển dụng nào</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {isAdmin && company.trangThai === 'CHỜ_XỬ_LÝ' && (
              <div className="card" style={{ border: '2px solid var(--tertiary)', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Hành động Admin</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  Công ty này đang chờ duyệt. Xem xét và đưa ra quyết định.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    {actionLoading ? 'Đang xử lý...' : 'Duyệt công ty'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="btn btn-danger"
                    style={{ justifyContent: 'center' }}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            )}

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Thông tin công ty</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Địa chỉ</p>
                    <p style={{ fontWeight: 500 }}>{company.diaChi || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                {company.website && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Website</p>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        Truy cập website
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Trạng thái</p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: status.bg,
                      color: status.color
                    }}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user?.vaiTro === 'TUYEN_DUNG' && company.nguoiDungId === user?.id && (
              <Link to="/company/edit" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                Chỉnh sửa thông tin
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CompanyDetailPage;
