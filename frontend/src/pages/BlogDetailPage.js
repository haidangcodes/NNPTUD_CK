import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const res = await blogService.getById(id);
      setBlog(res.data.data);
    } catch (err) {
      setError('Không tìm thấy bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await blogService.delete(id);
      navigate('/blogs');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error || !blog) {
    return (
      <div style={{ padding: '100px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>{error || 'Không tìm thấy bài viết'}</h2>
        <Link to="/blogs" className="btn btn-primary">← Quay lại bài viết</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ padding: '48px 32px', maxWidth: 800 }}>
          <Link
            to="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text-secondary)',
              marginBottom: 24,
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tất cả bài viết
          </Link>

          <p style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--secondary)',
            marginBottom: 16
          }}>
            {new Date(blog.ngayXuatBan || blog.ngayTao).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 24, lineHeight: 1.2 }}>
            {blog.tieuDe}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {blog.tacGiaEmail?.[0]?.toUpperCase() || blog.hoVaTenTacGia?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{blog.tacGiaEmail || blog.hoVaTenTacGia}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tác giả</p>
            </div>
            {user && (user.vaiTro === 'QUAN_TRI' || user.id === blog.tacGiaId) && (
              <button
                onClick={handleDelete}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(184, 64, 64, 0.1)',
                  color: 'var(--error)',
                  border: 'none',
                  padding: 10,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px', maxWidth: 800 }}>
        {blog.hinhAnhDaiDien && (
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 40, boxShadow: 'var(--shadow-lg)' }}>
            <img src={blog.hinhAnhDaiDien} alt={blog.tieuDe} style={{ width: '100%', height: 400, objectFit: 'cover' }} />
          </div>
        )}

        <div
          className="blog-content"
          style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: blog.noiDung }}
        />

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border-light)' }}>
          <Link to="/blogs" className="btn btn-ghost">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại tất cả bài viết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
