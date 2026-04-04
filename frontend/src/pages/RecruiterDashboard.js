import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, companyService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryRange: '',
    categoryId: ''
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
      setShowJobForm(false);
      setJobForm({ title: '', description: '', requirements: '', salaryRange: '', categoryId: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Xóa việc làm này?')) return;
    try {
      await jobService.delete(id);
      setMyJobs(myJobs.filter(j => j._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const viewApplications = async (jobId) => {
    try {
      const res = await applicationService.getByJob(jobId);
      alert(JSON.stringify(res.data.data, null, 2));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
      <h1>Trang Nhà Tuyển Dụng</h1>
      <p>Xin chào, {user?.email}</p>

      <section className="company-section">
        <h2>Công ty</h2>
        {company ? (
          <div className="company-info">
            <p><strong>{company.name}</strong></p>
            <p>{company.address}</p>
            <p>Trạng thái: {company.status}</p>
          </div>
        ) : (
          <p>Chưa có thông tin công ty</p>
        )}
      </section>

      <section className="jobs-section">
        <div className="section-header">
          <h2>Việc làm của tôi</h2>
          <button onClick={() => setShowJobForm(!showJobForm)} className="btn btn-primary">
            {showJobForm ? 'Hủy' : 'Đăng việc mới'}
          </button>
        </div>

        {showJobForm && (
          <form onSubmit={handleCreateJob} className="job-form">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={jobForm.title}
              onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Mô tả"
              value={jobForm.description}
              onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
              required
            />
            <textarea
              placeholder="Yêu cầu"
              value={jobForm.requirements}
              onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Mức lương"
              value={jobForm.salaryRange}
              onChange={e => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category ID"
              value={jobForm.categoryId}
              onChange={e => setJobForm({ ...jobForm, categoryId: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Đăng</button>
          </form>
        )}

        {myJobs.length === 0 ? (
          <p>Chưa có việc làm nào</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map(job => (
                <tr key={job._id}>
                  <td><Link to={`/jobs/${job._id}`}>{job.title}</Link></td>
                  <td>{job.categoryId?.name}</td>
                  <td><span className={`status ${job.status?.toLowerCase()}`}>{job.status}</span></td>
                  <td>
                    <button onClick={() => viewApplications(job._id)} className="btn btn-secondary">Xem đơn</button>
                    <button onClick={() => handleDeleteJob(job._id)} className="btn btn-danger">Xóa</button>
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

export default RecruiterDashboard;
