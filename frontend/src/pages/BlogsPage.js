import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await blogService.getAll();
      setBlogs(res.data.data.baiViets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blogs-page">
      <div className="page-header">
        <div className="container">
          <h1>Blog & Tin tức</h1>
          <p>Cập nhật những thông tin mới nhất về thị trường việc làm và xu hướng tuyển dụng</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="blog-card" style={{ height: 360 }} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3>Chưa có bài viết nào</h3>
            <p>Hãy quay lại sau để đọc những bài viết thú vị</p>
          </div>
        ) : (
          <div className="grid-3">
            {blogs.map((blog, index) => (
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
                  <p>{blog.noiDung?.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
