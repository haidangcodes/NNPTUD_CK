import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, categoryService, blogService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, catsRes, blogsRes] = await Promise.all([
        jobService.getAll({ limit: 6 }),
        categoryService.getAll(),
        blogService.getAll()
      ]);
      setJobs(jobsRes.data.data.viecLams || []);
      setCategories(Array.isArray(catsRes.data.data) ? catsRes.data.data : (catsRes.data.data.danhMucs || []));
      setBlogs(blogsRes.data.data.baiViets || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Khám phá cơ hội nghề nghiệp</span>
          <h1>Công việc <span>ít nhân khẩu</span> trong thế giới số</h1>
          <p>Kết nối với những doanh nghiệp hàng đầu, khám phá cơ hội phù hợp với kỹ năng và ambiton của bạn</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn btn-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Tìm việc ngay
            </Link>
            <Link to="/companies" className="btn btn-secondary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Khám phá công ty
            </Link>
          </div>
        </div>
      </header>

      <section className="alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Khám phá theo</span>
              <h2>Danh mục công việc</h2>
            </div>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 8).map((cat, index) => {
              const icons = {
                'Phát triển phần mềm': '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
                'Marketing': '<path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.144-2.142a1.76 1.76 0 01-3.417-.592l-2.144 2.142a1.76 1.76 0 01-3.417-.592L1.35 19.24a1.76 1.76 0 01.592-3.417L1.35 19.24l8.49-8.49a1.76 1.76 0 013.417-.592L12 14.823"/>',
                'Khoa học dữ liệu': '<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
                'DevOps': '<path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>',
                'Thiết kế': '<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
                'Tài chính - Kế toán': '<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
                'Nhân sự': '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
                'Chăm sóc khách hàng': '<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>'
              };
              const iconPath = icons[cat.tenDanhMuc] || '<circle cx="12" cy="12" r="10"/>';
              return (
                <Link
                  key={cat.id}
                  to={`/jobs?category=${cat.id}`}
                  className="category-item animate-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="category-icon-wrapper">
                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" dangerouslySetInnerHTML={{ __html: iconPath }} />
                  </div>
                  <span className="category-name">{cat.tenDanhMuc}</span>
                  <span className="category-count">{cat.soLuongTin || Math.floor(Math.random() * 20) + 5} việc</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Mới nhất</span>
              <h2>Tin tuyển dụng</h2>
            </div>
            <Link to="/jobs" className="btn btn-ghost">
              Xem tất cả
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card" style={{ height: 220, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Chưa có tin tuyển dụng</h3>
              <p>Hãy quay lại sau hoặc khám phá các danh mục khác</p>
            </div>
          ) : (
            <div className="grid-3">
              {jobs.map((job, index) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="job-card animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="job-card-header">
                    <div className="company-logo">{job.tenCongTy?.[0] || 'C'}</div>
                    <span className={`status ${job.trangThai?.toLowerCase()}`}>{job.trangThai}</span>
                  </div>
                  <h3>{job.tieuDe}</h3>
                  <p className="company-name">{job.tenCongTy || 'Công ty'}</p>
                  <div className="job-meta">
                    {(job.mucLuong || job.mucLuongToiDa) && (
                      <span>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.mucLuong ? `${Number(job.mucLuong).toLocaleString()} - ${job.mucLuongToiDa ? Number(job.mucLuongToiDa).toLocaleString() : ''}` : 'Thỏa thuận'}
                      </span>
                    )}
                    {job.tenDanhMuc && (
                      <span>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {job.tenDanhMuc}
                      </span>
                    )}
                  </div>
                  <div className="job-tags">
                    <span className="tag salary">{(job.mucLuong || job.mucLuongToiDa) ? `${Number(job.mucLuong || 0).toLocaleString()} - ${Number(job.mucLuongToiDa || 0).toLocaleString()}` : 'Thỏa thuận'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Tin tức</span>
              <h2>Bài viết mới nhất</h2>
            </div>
            <Link to="/blogs" className="btn btn-ghost">
              Đọc thêm
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {blogs.length > 0 ? (
            <div className="grid-3">
              {blogs.slice(0, 3).map((blog, index) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.id}`}
                  className="blog-card animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="blog-thumbnail">
                    {blog.hinhAnhDaiDien ? (
                      <img src={blog.hinhAnhDaiDien} alt={blog.tieuDe} />
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    )}
                  </div>
                  <div className="blog-content">
                    <p className="date">
                      {new Date(blog.ngayXuatBan || blog.ngayTao).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <h3>{blog.tieuDe}</h3>
                    <p>{blog.noiDung?.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Chưa có bài viết nào</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px' }}>Sẵn sàng bắt đầu?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '36px', fontSize: '1.1rem' }}>
            Đăng ký ngay để tiếp cận hàng ngàn cơ hội việc làm hấp dẫn
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--accent)' }}>
              Tạo tài khoản miễn phí
            </Link>
            <Link to="/jobs" className="btn btn-secondary" style={{ borderColor: 'white', color: 'white', background: 'transparent' }}>
              Tìm việc ngay
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Job<span>Portal</span></h3>
            <p>Nền tảng kết nối nhân tài với cơ hội nghề nghiệp hàng đầu Việt Nam</p>
          </div>
          <div className="footer-column">
            <h4>Khám phá</h4>
            <Link to="/jobs">Việc làm</Link>
            <Link to="/companies">Công ty</Link>
            <Link to="/blogs">Blog</Link>
          </div>
          <div className="footer-column">
            <h4>Cho nhà tuyển dụng</h4>
            <Link to="/register">Đăng ký</Link>
            <Link to="/login">Đăng nhập</Link>
            {user?.vaiTro === 'TUYEN_DUNG' && <Link to="/dashboard/recruiter">Dashboard</Link>}
            {user?.vaiTro === 'QUAN_TRI' && <Link to="/dashboard/admin">Admin</Link>}
          </div>
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <Link to="/">Trung tâm trợ giúp</Link>
            <Link to="/">Điều khoản sử dụng</Link>
            <Link to="/">Chính sách bảo mật</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 JobPortal. Tất cả quyền được bảo lưu.</span>
          <span>Made with ❤️ in Vietnam</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
