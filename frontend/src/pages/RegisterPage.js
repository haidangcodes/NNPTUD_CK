import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    vaiTro: 'UNG_VIEN'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'UNG_VIEN', label: 'Ứng viên', desc: 'Tìm kiếm việc làm', icon: '👤' },
    { value: 'TUYEN_DUNG', label: 'Nhà tuyển dụng', desc: 'Đăng tin tuyển dụng', icon: '🏢' }
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Tạo tài khoản mới</h1>
        <p className="subtitle">Tham gia JobPortal ngay hôm nay</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div className="form-group">
            <label>Bạn là...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {roleOptions.map((role) => (
                <label
                  key={role.value}
                  style={{
                    padding: 20,
                    border: `2px solid ${formData.vaiTro === role.value ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: formData.vaiTro === role.value ? 'var(--accent-dim)' : 'transparent',
                    transition: 'all 0.25s ease',
                    textAlign: 'center'
                  }}
                >
                  <input
                    type="radio"
                    name="vaiTro"
                    value={role.value}
                    checked={formData.vaiTro === role.value}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>{role.icon}</span>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>
                    {role.label}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {role.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? (
              <>
                <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>

      <p style={{ position: 'absolute', bottom: 28, color: 'var(--text-muted)', zIndex: 1 }}>
        <Link to="/" style={{ color: 'inherit' }}>← Quay lại trang chủ</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
