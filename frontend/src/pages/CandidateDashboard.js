import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService, profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appRes, profileRes] = await Promise.all([
        applicationService.getMyApplications(),
        profileService.getMe()
      ]);
      setApplications(appRes.data.data || []);
      setProfile(profileRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (id) => {
    try {
      await applicationService.delete(id);
      setApplications(applications.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
      <h1>Trang Ứng Viên</h1>
      <p>Xin chào, {user?.email}</p>

      <section className="profile-section">
        <h2>Hồ sơ của tôi</h2>
        {profile ? (
          <div className="profile-info">
            <p>{profile.bio || 'Chưa có thông tin'}</p>
            <Link to="/profile/edit" className="btn btn-secondary">Chỉnh sửa</Link>
          </div>
        ) : (
          <Link to="/profile/edit" className="btn btn-primary">Tạo hồ sơ</Link>
        )}
      </section>

      <section className="applications-section">
        <h2>Đơn ứng tuyển</h2>
        {applications.length === 0 ? (
          <p>Chưa có đơn ứng tuyển nào</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Việc làm</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td><Link to={`/jobs/${app.jobId?._id}`}>{app.jobId?.title}</Link></td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td><span className={`status ${app.status?.toLowerCase()}`}>{app.status}</span></td>
                  <td>
                    <button onClick={() => handleCancelApplication(app._id)} className="btn btn-danger">Hủy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default CandidateDashboard;
