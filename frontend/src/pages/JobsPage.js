import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, [searchParams]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.get('category')) params.danhMucId = searchParams.get('category');
      if (search) params.tieuDe = search;

      const res = await jobService.getAll(params);
      let jobsData = res.data.data.vieclam || res.data.data.viecLams || [];

      if (statusFilter !== 'all') {
        jobsData = jobsData.filter(j => j.trangThai === statusFilter);
      }

      setJobs(jobsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
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

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div className="container">
          <h1>Tìm việc làm</h1>
          <p>Khám phá hàng ngàn cơ hội nghề nghiệp phù hợp với bạn</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm vị trí, công ty, hoặc từ khóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Tìm kiếm</button>
        </form>

        <div className="filter-bar">
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Lọc theo:</span>
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'ĐANG_TUYỂN', label: 'Đang tuyển' },
            { value: 'NHÁP', label: 'Nháp' },
            { value: 'ĐÃ_ĐÓNG', label: 'Đã đóng' }
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`btn ${statusFilter === status.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              {status.label}
            </button>
          ))}
          <span className="count">{jobs.length} tin tuyển dụng</span>
        </div>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card" style={{ height: 240, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Không tìm thấy tin tuyển dụng</h3>
            <p>Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setSearchParams({}); }}
              className="btn btn-ghost"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {jobs.map((job, index) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="job-card animate-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="job-card-header">
                  <div className="company-logo">{job.tenCongTy?.[0] || 'C'}</div>
                  <span className={`status ${statusColors[job.trangThai] || 'closed'}`}>
                    {statusLabels[job.trangThai] || job.trangThai}
                  </span>
                </div>
                <h3>{job.tieuDe}</h3>
                <p className="company-name">{job.tenCongTy || 'Công ty'}</p>
                <div className="job-meta">
                  {(job.mucLuong || job.mucLuongToiDa) && (
                    <span>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.mucLuong ? `${Number(job.mucLuong).toLocaleString()} - ${job.mucLuongToiDa ? Number(job.mucLuongToiDa).toLocaleString() : ''}` : ''}
                    </span>
                  )}
                  {job.diaChiCongTy && (
                    <span>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.diaChiCongTy}
                    </span>
                  )}
                </div>
                <div className="job-tags">
                  {job.tenDanhMuc && (
                    <span className="tag">{job.tenDanhMuc}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
