import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, companyService, applicationService } from '../services/api';
import { getFullUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [categories, setCategories] = useState([]);

  const [jobForm, setJobForm] = useState({
    tieuDe: '',
    moTa: '',
    yeuCau: '',
    mucLuong: '',
    danhMucId: ''
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
      setActiveTab('jobs');
      setJobForm({ tieuDe: '', moTa: '', yeuCau: '', mucLuong: '', danhMucId: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Xóa việc làm này?')) return;
    try {
      await jobService.delete(id);
      setMyJobs(myJobs.filter(j => j.id !== id));
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
      console.error('Error fetching applications:', err);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      // Refresh applications list
      viewApplications(selectedJobApps);
    } catch (err) {
      console.error(err);
    }
  };

  const appStatusColors = {
    'DA_NOP': 'pending',
    'DANG_XEM': 'active',
    'TRUNG_TUYEN': 'active',
    'TUYEN_THANG': 'active',
    'TU_CHOI': 'rejected',
    'RUT_HO_SO': 'rejected'
  };

  const appStatusLabels = {
    'DA_NOP': 'Đã nộp',
    'DANG_XEM': 'Đang xem',
    'TRUNG_TUYEN': 'Trúng tuyển',
    'TUYEN_THANG': 'Tuyển thẳng',
    'TU_CHOI': 'Từ chối',
    'RUT_HO_SO': 'Rút hồ sơ'
  };

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

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Nhà tuyển dụng</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Chào mừng, {user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/dashboard/interviews" className="btn btn-secondary">
            Xem lịch phỏng vấn
          </Link>
          <Link to="/company/edit" className="btn btn-primary">
            {company ? 'Chỉnh sửa công ty' : 'Tạo công ty'}
          </Link>
        </div>
      </div>

      {company && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
          color: 'white',
          marginBottom: 32
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700
            }}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.tenCongTy} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
              ) : (
                company.tenCongTy?.[0] || 'C'
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: 4 }}>{company.tenCongTy}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem' }}>{company.diaChi || 'Chưa cập nhật địa chỉ'}</p>
            </div>
            <span style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: company.trangThai === 'ĐƯỢC_DUYỆT' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
              color: 'white'
            }}>
              {company.trangThai === 'ĐƯỢC_DUYỆT' ? 'Đã duyệt' : company.trangThai === 'CHỜ_XỬ_LÝ' ? 'Chờ duyệt' : company.trangThai}
            </span>
          </div>
        </div>
      )}

      <div className="tabs">
        <button
          onClick={() => setActiveTab('jobs')}
          className={activeTab === 'jobs' ? 'active' : ''}
        >
          Tin tuyển dụng ({myJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={activeTab === 'create' ? 'active' : ''}
        >
          Đăng tin mới
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: 24 }}>Đăng tin tuyển dụng mới</h3>
          <form onSubmit={handleCreateJob}>
            <div className="form-group">
              <label>Tên vị trí *</label>
              <input
                type="text"
                value={jobForm.tieuDe}
                onChange={(e) => setJobForm({ ...jobForm, tieuDe: e.target.value })}
                placeholder="VD: Senior React Developer"
                required
              />
            </div>
            <div className="form-group">
              <label>Mô tả *</label>
              <textarea
                value={jobForm.moTa}
                onChange={(e) => setJobForm({ ...jobForm, moTa: e.target.value })}
                rows={4}
                placeholder="Mô tả chi tiết về vị trí..."
                required
              />
            </div>
            <div className="form-group">
              <label>Yêu cầu *</label>
              <textarea
                value={jobForm.yeuCau}
                onChange={(e) => setJobForm({ ...jobForm, yeuCau: e.target.value })}
                rows={3}
                placeholder="Liệt kê các yêu cầu..."
                required
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Mức lương</label>
                <input
                  type="text"
                  value={jobForm.mucLuong}
                  onChange={(e) => setJobForm({ ...jobForm, mucLuong: e.target.value })}
                  placeholder="VD: 10000000 - 20000000"
                />
              </div>
              <div className="form-group">
                <label>ID Danh mục</label>
                <input
                  type="text"
                  value={jobForm.danhMucId}
                  onChange={(e) => setJobForm({ ...jobForm, danhMucId: e.target.value })}
                  placeholder="ID danh mục"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <button type="button" onClick={() => setActiveTab('jobs')} className="btn btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Đăng tin
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="table-container">
          {myJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Chưa có tin tuyển dụng nào</h3>
              <p>Đăng tin đầu tiên để bắt đầu nhận hồ sơ</p>
              <button onClick={() => setActiveTab('create')} className="btn btn-primary" style={{ marginTop: 8 }}>
                Đăng tin ngay
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tên vị trí</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} style={{ fontWeight: 600, color: 'var(--accent)' }}>
                        {job.tieuDe}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(job.ngayTao).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`status ${statusColors[job.trangThai] || ''}`}>
                        {statusLabels[job.trangThai] || job.trangThai}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => viewApplications(job.id)}
                        style={{
                          color: 'var(--text-secondary)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.88rem',
                          marginRight: 16
                        }}
                      >
                        Xem hồ sơ
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.88rem' }}
                      >
                        Xóa
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
          onClick={() => setSelectedJobApps(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 24,
              maxWidth: 560,
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
              <h3 style={{ fontSize: '1.2rem' }}>Danh sách ứng viên</h3>
              <button
                onClick={() => setSelectedJobApps(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
              {jobApplications.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có hồ sơ nào</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {jobApplications.map(app => (
                    <div key={app.id} style={{
                      padding: 16,
                      borderRadius: 14,
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-secondary)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <p style={{ fontWeight: 600 }}>{app.hoVaTen || app.email || 'N/A'}</p>
                        <span className={`status ${appStatusColors[app.trangThai] || ''}`}>
                          {appStatusLabels[app.trangThai] || app.trangThai}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Ứng tuyển: {new Date(app.ngayNop).toLocaleDateString('vi-VN')}
                      </p>
                      {app.cvUrl && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            CV: {getFullUrl(app.cvUrl)}
                          </span>
                          <a
                            href={getFullUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={`CV_${app.hoVaTen || 'ungvien'}.pdf`}
                            style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem' }}
                          >
                            Tải CV
                          </a>
                        </span>
                      )}
                      {app.trangThai === 'DA_NOP' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'DANG_XEM')}
                            style={{
                              background: 'var(--warning)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Đang xem
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'TRUNG_TUYEN')}
                            style={{
                              background: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Trúng tuyển
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'TU_CHOI')}
                            style={{
                              background: 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                      {app.trangThai === 'DANG_XEM' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'TRUNG_TUYEN')}
                            style={{
                              background: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Trúng tuyển
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'TU_CHOI')}
                            style={{
                              background: 'var(--error)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                      {app.trangThai === 'TRUNG_TUYEN' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'TUYEN_THANG')}
                            style={{
                              background: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Tuyển thẳng
                          </button>
                        </div>
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
  );
};

export default RecruiterDashboard;
