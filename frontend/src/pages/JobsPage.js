import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobService.getAll();
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="jobs-page">
      <h1>Danh sách việc làm</h1>
      <div className="job-list">
        {jobs.map(job => (
          <Link key={job._id} to={`/jobs/${job._id}`} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.companyId?.name || 'Công ty'}</p>
            <p className="location">{job.companyId?.address}</p>
            <div className="job-meta">
              <span>{job.categoryId?.name}</span>
              <span>{job.salaryRange || 'Thỏa thuận'}</span>
              <span className={`status ${job.status?.toLowerCase()}`}>{job.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
