import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const res = await jobService.getById(id);
      setJob(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await applicationService.apply({
        jobId: id,
        cvUrl: '/uploads/cvs/sample.pdf'
      });
      setApplySuccess(true);
      setApplyError('');
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Ứng tuyển thất bại');
      setApplySuccess(false);
    }
  };

  if (!job) return <div className="loading">Đang tải...</div>;

  return (
    <div className="job-detail-page">
      <h1>{job.title}</h1>
      <div className="company-info">
        <h3>{job.companyId?.name}</h3>
        <p>{job.companyId?.address}</p>
        <p>{job.companyId?.website}</p>
      </div>

      <div className="job-info">
        <p><strong>Ngành:</strong> {job.categoryId?.name}</p>
        <p><strong>Mức lương:</strong> {job.salaryRange || 'Thỏa thuận'}</p>
        <p><strong>Trạng thái:</strong> {job.status}</p>
      </div>

      <div className="job-description">
        <h3>Mô tả</h3>
        <p>{job.description}</p>
      </div>

      <div className="job-requirements">
        <h3>Yêu cầu</h3>
        <p>{job.requirements}</p>
      </div>

      {applySuccess && <div className="success">Ứng tuyển thành công!</div>}
      {applyError && <div className="error">{applyError}</div>}

      {user?.role === 'CANDIDATE' && job.status === 'ACTIVE' && (
        <button onClick={handleApply} className="btn btn-primary">Ứng tuyển</button>
      )}
    </div>
  );
};

export default JobDetailPage;
