import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InterviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [toast, setToast] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    ngayPhongVan: '',
    thoiGianBatDau: '',
    diaDiem: 'TRUC_TIEP',
    diaDiemCuThe: '',
    linkHop: '',
    nguoiPhongVan: '',
    ghiChu: ''
  });

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

  const loadApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      // Filter applications that are DANG_XEM or TRUNG_TUYEN for scheduling
      const schedulable = (res.data.data || []).filter(
        app => ['DANG_XEM', 'TRUNG_TUYEN'].includes(app.trangThai)
      );
      setApplications(schedulable);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Hủy lịch phỏng vấn này?')) return;
    try {
      await interviewService.delete(id);
      showToast('Đã hủy lịch phỏng vấn');
      loadInterviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xóa thất bại', 'error');
    }
  };

  const openScheduleModal = () => {
    loadApplications();
    setShowScheduleModal(true);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) {
      showToast('Vui lòng chọn ứng viên', 'error');
      return;
    }
    try {
      const data = {
        ungTuyenId: selectedApp.id,
        ngayPhongVan: `${scheduleForm.ngayPhongVan}T${scheduleForm.thoiGianBatDau}:00`,
        diaDiem: scheduleForm.diaDiem,
        diaDiemCuThe: scheduleForm.diaDiemCuThe,
        linkHop: scheduleForm.linkHop,
        nguoiPhongVan: scheduleForm.nguoiPhongVan,
        ghiChu: scheduleForm.ghiChu
      };
      await interviewService.create(data);
      showToast('Đã tạo lịch phỏng vấn');
      setShowScheduleModal(false);
      setSelectedApp(null);
      setScheduleForm({
        ngayPhongVan: '',
        thoiGianBatDau: '',
        diaDiem: 'TRUC_TIEP',
        diaDiemCuThe: '',
        linkHop: '',
        nguoiPhongVan: '',
        ghiChu: ''
      });
      loadInterviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Tạo lịch thất bại', 'error');
    }
  };

  const now = new Date();
  const upcomingInterviews = interviews.filter(i => new Date(i.ngayPhongVan) > now);
  const pastInterviews = interviews.filter(i => new Date(i.ngayPhongVan) <= now);

  const displayedInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  const isRecruiter = user?.vaiTro === 'TUYEN_DUNG';
  const isAdmin = user?.vaiTro === 'QUAN_TRI';

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
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

      <div className="dashboard-header">
        <div>
          <h1>Lịch phỏng vấn</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {isRecruiter || isAdmin ? 'Quản lý lịch phỏng vấn ứng viên' : 'Các lịch phỏng vấn của bạn'}
          </p>
        </div>
        {(isRecruiter || isAdmin) && (
          <button onClick={openScheduleModal} className="btn btn-primary">
            + Tạo lịch phỏng vấn
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={activeTab === 'upcoming' ? 'active' : ''}
        >
          Sắp tới ({upcomingInterviews.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={activeTab === 'past' ? 'active' : ''}
        >
          Đã qua ({pastInterviews.length})
        </button>
      </div>

      {displayedInterviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div className="empty-state-icon" style={{ marginBottom: 16 }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3>Không có lịch phỏng vấn nào</h3>
          <p>
            {isRecruiter || isAdmin
              ? 'Sắp xếp phỏng vấn với ứng viên để xem tại đây'
              : 'Bạn không có lịch phỏng vấn nào được sắp xếp'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {displayedInterviews.map((interview) => (
            <div key={interview.id} className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="22" height="22" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {new Date(interview.ngayPhongVan).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {new Date(interview.ngayPhongVan).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {interview.viecLamTieuDe && (
                    <p style={{ color: 'var(--text-secondary)', marginLeft: 62 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Vị trí:</span>{' '}
                      {interview.viecLamTieuDe}
                    </p>
                  )}
                  {interview.tenCongTy && (
                    <p style={{ color: 'var(--text-secondary)', marginLeft: 62 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Công ty:</span>{' '}
                      {interview.tenCongTy}
                    </p>
                  )}
                  {interview.loaiPhongVan && (
                    <p style={{ color: 'var(--text-secondary)', marginLeft: 62 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hình thức:</span>{' '}
                      {interview.loaiPhongVan === 'TRUC_TIEP' ? 'Trực tiếp' : 'Online'}
                    </p>
                  )}
                  {interview.diaDiemCuThe && (
                    <p style={{ color: 'var(--text-secondary)', marginLeft: 62 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Địa điểm:</span>{' '}
                      {interview.diaDiemCuThe}
                    </p>
                  )}
                  {interview.ghiChu && (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 12, marginLeft: 62 }}>
                      "{interview.ghiChu}"
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                  {(isRecruiter || isAdmin) && (
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      style={{
                        background: 'rgba(184, 64, 64, 0.1)',
                        border: 'none',
                        padding: 12,
                        borderRadius: 10,
                        cursor: 'pointer',
                        color: 'var(--error)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showScheduleModal && (
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
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 24,
              maxWidth: 500,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.2rem' }}>Tạo lịch phỏng vấn</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleScheduleInterview} style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
              <div className="form-group">
                <label>Chọn ứng viên *</label>
                <select
                  value={selectedApp?.id || ''}
                  onChange={(e) => {
                    const app = applications.find(a => a.id === e.target.value);
                    setSelectedApp(app || null);
                  }}
                  required
                >
                  <option value="">-- Chọn ứng viên --</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.hoVaTen || app.email} - {app.tieuDe}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Ngày phỏng vấn *</label>
                  <input
                    type="date"
                    value={scheduleForm.ngayPhongVan}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, ngayPhongVan: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Giờ *</label>
                  <input
                    type="time"
                    value={scheduleForm.thoiGianBatDau}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, thoiGianBatDau: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hình thức</label>
                <select
                  value={scheduleForm.diaDiem}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, diaDiem: e.target.value })}
                >
                  <option value="TRUC_TIEP">Trực tiếp</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>

              {scheduleForm.diaDiem === 'TRUC_TIEP' ? (
                <div className="form-group">
                  <label>Địa điểm cụ thể</label>
                  <input
                    type="text"
                    value={scheduleForm.diaDiemCuThe}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, diaDiemCuThe: e.target.value })}
                    placeholder="VD: Tầng 3, Tòa nhà ABC..."
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Link cuộc họp</label>
                  <input
                    type="url"
                    value={scheduleForm.linkHop}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, linkHop: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              )}

              <div className="form-group">
                <label>Người phỏng vấn</label>
                <input
                  type="text"
                  value={scheduleForm.nguoiPhongVan}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, nguoiPhongVan: e.target.value })}
                  placeholder="Tên người phỏng vấn"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={scheduleForm.ghiChu}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, ghiChu: e.target.value })}
                  rows={3}
                  placeholder="Ghi chú cho ứng viên..."
                />
              </div>

              <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Tạo lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
