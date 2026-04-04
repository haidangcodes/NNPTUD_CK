import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, categoryService } from '../services/api';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, catsRes] = await Promise.all([
        jobService.getAll({ limit: 6 }),
        categoryService.getAll()
      ]);
      setJobs(jobsRes.data.data.jobs || []);
      setCategories(catsRes.data.data || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Tìm Việc Làm Việc</h1>
        <p>Kết nối ứng viên với nhà tuyển dụng</p>
        <div className="hero-buttons">
          <Link to="/jobs" className="btn btn-primary">Xem việc làm</Link>
          <Link to="/login" className="btn btn-secondary">Đăng nhập</Link>
        </div>
      </header>

      <section className="categories">
        <h2>Danh mục</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <Link key={cat._id} to={`/jobs?category=${cat._id}`} className="category-card">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="latest-jobs">
        <h2>Việc làm mới nhất</h2>
        <div className="job-list">
          {jobs.map(job => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.companyId?.name || 'Công ty'}</p>
              <span className="salary">{job.salaryRange || 'Thỏa thuận'}</span>
              <span className="status">{job.status}</span>
            </Link>
          ))}
        </div>
        <Link to="/jobs" className="btn btn-primary">Xem thêm</Link>
      </section>
    </div>
  );
};

export default HomePage;
