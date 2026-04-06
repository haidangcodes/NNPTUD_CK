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
      const [appRes, interviewRes] = await Promise.all([
        applicationService.getMyApplications(),
        interviewService.getMyInterviews()
      ]);
      setApplications(appRes.data.data || []);
      setInterviews(interviewRes.data.data || []);

      // Profile might not exist yet, handle separately
      try {
        const profileRes = await profileService.getMe();
        setProfile(profileRes.data.data);
      } catch (profileErr) {
        // Profile doesn't exist yet - that's ok
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (id) => {
    if (!window.confirm('Hủy đơn ứng tuyển này?')) return;
    try {
      await applicationService.delete(id);
      setApplications(applications.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    'DA_NOP': 'pending',
    'DANG_XEM': 'pending',
    'TRUNG_TUYEN': 'active',
    'TUYEN_THANG': 'active',
    'TU_CHOI': 'rejected',
    'RUT_HO_SO': 'rejected'
  };

  const statusLabels = {
    'DA_NOP': 'Đã nộp',
    'DANG_XEM': 'Đang xem',
    'TRUNG_TUYEN': 'Trúng tuyển',
    'TUYEN_THANG': 'Tuyển thẳng',
    'TU_CHOI': 'Từ chối',
    'RUT_HO_SO': 'Rút hồ sơ'
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  const upcomingInterviews = interviews.filter(i => new Date(i.ngayPhongVan) > new Date());

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Ứng viên</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Chào mừng, {user?.email}</p>
        </div>
        <Link to="/profile/edit" className="btn btn-primary">
          Chỉnh sửa hồ sơ
        </Link>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('applications')}
          className={activeTab === 'applications' ? 'active' : ''}
        >
          Đơn ứng tuyển ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={activeTab === 'interviews' ? 'active' : ''}
        >
          Lịch phỏng vấn ({upcomingInterviews.length})
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="table-container">
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Chưa có đơn ứng tuyển nào</h3>
              <p>Bắt đầu ứng tuyển để xem tại đây</p>
              <Link to="/jobs" className="btn btn-primary">Tìm việc ngay</Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Công việc</th>
                  <th>Ngày ứng tuyển</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <Link to={`/jobs/${app.viecLamId}`} style={{ fontWeight: 600, color: 'var(--accent)' }}>
                        {app.tieuDe || 'N/A'}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(app.ngayNop).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`status ${statusColors[app.trangThai] || ''}`}>
                        {statusLabels[app.trangThai] || app.trangThai}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {['DA_NOP', 'DANG_XEM'].includes(app.trangThai) && (
                        <button
                          onClick={() => handleCancelApplication(app.id)}
                          style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.88rem' }}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'interviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {upcomingInterviews.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div className="empty-state-icon" style={{ marginBottom: 16 }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Không có lịch phỏng vấn sắp tới</h3>
              <p>Khi nhà tuyển dụng sắp xếp phỏng vấn, lịch sẽ hiển thị tại đây</p>
            </div>
          ) : (
            upcomingInterviews.map(interview => (
              <div key={interview.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {new Date(interview.ngayPhongVan).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {new Date(interview.ngayPhongVan).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {interview.viecLamTieuDe && (
                      <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                        Vị trí: {interview.viecLamTieuDe}
                      </p>
                    )}
                    {interview.ghiChu && (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 8 }}>
                        "{interview.ghiChu}"
                      </p>
                    )}
                  </div>
                  {interview.linkHop && (
                    <a
                      href={interview.linkHop}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Tham gia phỏng vấn
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
