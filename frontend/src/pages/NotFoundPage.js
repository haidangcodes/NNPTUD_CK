import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'var(--bg-primary)'
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <div style={{
            fontSize: '160px',
            fontWeight: '800',
            color: 'var(--border)',
            fontFamily: 'Playfair Display, serif',
            lineHeight: 1,
            letterSpacing: '-0.04em'
          }}>
            404
          </div>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--tertiary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(196, 93, 58, 0.3)'
            }}>
              <svg width="36" height="36" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Trang không tìm thấy</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1.1rem' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            Quay về trang chủ
          </Link>
          <Link to="/jobs" className="btn btn-secondary">
            Tìm việc ngay
          </Link>
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.88rem' }}>Hoặc khám phá thêm</p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <Link to="/companies" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Công ty</Link>
            <Link to="/blogs" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Blog</Link>
            <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
