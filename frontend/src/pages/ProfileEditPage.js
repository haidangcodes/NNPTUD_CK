import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, uploadService } from '../services/api';
import { getFullUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    hoVaTen: '',
    ngaySinh: '',
    gioiTinh: '',
    diaChi: '',
    tinhThanh: '',
    soDienThoai: '',
    gioiThieuBanThan: '',
    kyNang: '',
    kinhNghiemLamViec: '',
    hocVan: '',
    ngoaiNgu: '',
    chungChi: '',
    cvUrl: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileService.getMe();
      const data = res.data.data;
      setFormData({
        hoVaTen: data.hoVaTen || '',
        ngaySinh: data.ngaySinh || '',
        gioiTinh: data.gioiTinh || '',
        diaChi: data.diaChi || '',
        tinhThanh: data.tinhThanh || '',
        soDienThoai: data.soDienThoai || '',
        gioiThieuBanThan: data.gioiThieuBanThan || '',
        kyNang: Array.isArray(data.kyNang) ? data.kyNang.join(', ') : (data.kyNang || ''),
        kinhNghiemLamViec: data.kinhNghiemLamViec || '',
        hocVan: data.hocVan || '',
        ngoaiNgu: data.ngoaiNgu || '',
        chungChi: data.chungChi || '',
        cvUrl: data.cvUrl || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCV(true);
      const res = await uploadService.uploadCV(file);
      setFormData({ ...formData, cvUrl: res.data.data.url });
      showToast('Đã tải lên CV thành công');
    } catch (err) {
      showToast(err.response?.data?.message || 'Tải lên thất bại', 'error');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...formData,
        kyNang: formData.kyNang.split(',').map(s => s.trim()).filter(Boolean)
      };
      await profileService.updateMe(data);
      showToast('Đã cập nhật hồ sơ');
      setTimeout(() => navigate('/dashboard/candidate'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Cập nhật thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
      {toast && (
        <div style={{
          position: 'fixed',
          top: 100,
          right: 24,
          zIndex: 1000,
          padding: '14px 24px',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          background: toast.type === 'error' ? 'var(--error)' : 'var(--success)',
          color: 'white',
          fontWeight: 600
        }}>
          {toast.message}
        </div>
      )}

      <div className="container" style={{ padding: '48px 32px', maxWidth: 640 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-secondary)',
            marginBottom: 24,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500,
            padding: 0
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: 20
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white'
            }}>
              {formData.hoVaTen?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', marginBottom: 4 }}>Chỉnh sửa hồ sơ</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 32, background: 'var(--bg-card)' }}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="hoVaTen"
                value={formData.hoVaTen}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange}>
                  <option value="">Chọn</option>
                  <option value="NAM">Nam</option>
                  <option value="NU">Nữ</option>
                  <option value="KHAC">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                placeholder="+84 xxx xxx xxx"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                placeholder="Địa chỉ của bạn"
              />
            </div>

            <div className="form-group">
              <label>Tỉnh/Thành</label>
              <input
                type="text"
                name="tinhThanh"
                value={formData.tinhThanh}
                onChange={handleChange}
                placeholder="VD: Hồ Chí Minh"
              />
            </div>

            <div className="form-group">
              <label>Giới thiệu bản thân</label>
              <textarea
                name="gioiThieuBanThan"
                value={formData.gioiThieuBanThan}
                onChange={handleChange}
                rows={3}
                placeholder="Viết vài dòng giới thiệu về bản thân..."
              />
            </div>

            <div className="form-group">
              <label>Kỹ năng</label>
              <input
                type="text"
                name="kyNang"
                value={formData.kyNang}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js (phân cách bằng dấu phẩy)"
              />
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Phân cách các kỹ năng bằng dấu phẩy
              </p>
            </div>

            <div className="form-group">
              <label>Kinh nghiệm làm việc</label>
              <textarea
                name="kinhNghiemLamViec"
                value={formData.kinhNghiemLamViec}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả kinh nghiệm làm việc..."
              />
            </div>

            <div className="form-group">
              <label>Học vấn</label>
              <textarea
                name="hocVan"
                value={formData.hocVan}
                onChange={handleChange}
                rows={2}
                placeholder="Trình độ học vấn..."
              />
            </div>

            <div className="form-group">
              <label>Ngoại ngữ</label>
              <input
                type="text"
                name="ngoaiNgu"
                value={formData.ngoaiNgu}
                onChange={handleChange}
                placeholder="VD: English - IELTS 7.0"
              />
            </div>

            <div className="form-group">
              <label>Chứng chỉ</label>
              <input
                type="text"
                name="chungChi"
                value={formData.chungChi}
                onChange={handleChange}
                placeholder="Các chứng chỉ đã có..."
              />
            </div>

            <div className="form-group">
              <label>CV / Sơ yếu lý lịch</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCVUpload}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCV}
                  className="btn btn-secondary"
                >
                  {uploadingCV ? (
                    <>
                      <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Tải lên CV
                    </>
                  )}
                </button>
                {formData.cvUrl && (
                  <a
                    href={getFullUrl(formData.cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem' }}
                  >
                    Xem CV hiện tại
                  </a>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.5 : 1 }}
              >
                {saving ? (
                  <>
                    <span className="loading" style={{ marginRight: 8, minHeight: 20 }} />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
