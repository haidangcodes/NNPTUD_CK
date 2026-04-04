import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CANDIDATE'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="auth-page">
      <h1>Đăng ký</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="form-group">
          <label>Vai trò</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="CANDIDATE">Ứng viên</option>
            <option value="RECRUITER">Nhà tuyển dụng</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Đăng ký</button>
      </form>
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
};

export default RegisterPage;
