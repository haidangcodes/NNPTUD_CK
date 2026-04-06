import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService, categoryService, blogService } from '../services/api';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('companies');
  const [loading, setLoading] = useState(true);

  const [catForm, setCatForm] = useState({ tenDanhMuc: '', moTa: '' });
  const [blogForm, setBlogForm] = useState({ tieuDe: '', noiDung: '', hinhAnhDaiDien: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [compRes, catRes, blogRes] = await Promise.all([
        companyService.getAll(),
        categoryService.getAll(),
        blogService.getAll()
      ]);
      setCompanies(compRes.data.data || []);
      setCategories(catRes.data.data.danhMucs || catRes.data.data || []);
      setBlogs(blogRes.data.data.baiViets || blogRes.data.data || []);
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

  const handleApprove = async (id) => {
    try {
      await companyService.approve(id);
      showToast('Đã duyệt công ty');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await companyService.reject(id);
      showToast('Đã từ chối công ty');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Xóa công ty này?')) return;
    try {
      await companyService.delete(id);
      showToast('Đã xóa công ty');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.create(catForm);
      setCatForm({ tenDanhMuc: '', moTa: '' });
      showToast('Đã tạo danh mục');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await categoryService.delete(id);
      showToast('Đã xóa danh mục');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await blogService.create(blogForm);
      setBlogForm({ tieuDe: '', noiDung: '', hinhAnhDaiDien: '' });
      showToast('Đã tạo bài viết');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await blogService.delete(id);
      showToast('Đã xóa bài viết');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thất bại', 'error');
    }
  };

  const statusColors = {
    'ĐƯỢC_DUYỆT': 'active',
    'CHỜ_XỬ_LÝ': 'pending',
    'BỊ_TỪ_CHỐI': 'rejected'
  };

  const statusLabels = {
    'ĐƯỢC_DUYỆT': 'Đã duyệt',
    'CHỜ_XỬ_LÝ': 'Chờ duyệt',
    'BỊ_TỪ_CHỐI': 'Từ chối'
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  const pendingCompanies = companies.filter(c => c.trangThai === 'CHỜ_XỬ_LÝ').length;

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

      <div style={{ background: 'var(--bg-dark)', padding: '48px 32px', marginBottom: 0 }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 8 }}>Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Quản lý nền tảng</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>
        <div className="tabs">
          {[
            { key: 'companies', label: 'Công ty', count: companies.length, highlight: pendingCompanies > 0 },
            { key: 'categories', label: 'Danh mục', count: categories.length },
            { key: 'blogs', label: 'Blog', count: blogs.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? 'active' : ''}
            >
              {tab.label}
              <span style={{
                marginLeft: 8,
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: '0.78rem',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)'
              }}>
                {tab.count}
              </span>
              {tab.highlight && activeTab !== tab.key && (
                <span style={{
                  marginLeft: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--warning)',
                  display: 'inline-block'
                }} />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'companies' && (
          <div className="table-container">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Quản lý công ty</h2>
              {pendingCompanies > 0 && (
                <p style={{ color: 'var(--warning)', fontSize: '0.88rem' }}>
                  {pendingCompanies} công ty đang chờ duyệt
                </p>
              )}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Công ty</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(comp => (
                  <tr key={comp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: 'var(--bg-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: 'var(--accent)'
                        }}>
                          {comp.logoUrl ? (
                            <img src={comp.logoUrl} alt={comp.tenCongTy} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                          ) : (
                            comp.tenCongTy?.[0] || 'C'
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600 }}>{comp.tenCongTy}</p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{comp.diaChi || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{comp.emailLienHe}</td>
                    <td>
                      <span className={`status ${statusColors[comp.trangThai] || ''}`}>
                        {statusLabels[comp.trangThai] || comp.trangThai}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {comp.trangThai === 'CHỜ_XỬ_LÝ' && (
                        <>
                          <button
                            onClick={() => handleApprove(comp.id)}
                            style={{
                              color: 'var(--success)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '0.88rem',
                              marginRight: 16
                            }}
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(comp.id)}
                            style={{
                              color: 'var(--warning)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '0.88rem',
                              marginRight: 16
                            }}
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCompany(comp.id)}
                        style={{
                          color: 'var(--error)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.88rem'
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Thêm danh mục mới</h3>
              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label>Tên danh mục</label>
                  <input
                    type="text"
                    value={catForm.tenDanhMuc}
                    onChange={(e) => setCatForm({ ...catForm, tenDanhMuc: e.target.value })}
                    placeholder="VD: Công nghệ thông tin"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <input
                    type="text"
                    value={catForm.moTa}
                    onChange={(e) => setCatForm({ ...catForm, moTa: e.target.value })}
                    placeholder="Mô tả tùy chọn"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Tạo danh mục
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Tất cả danh mục ({categories.length})</h3>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border-light)'
                  }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{cat.tenDanhMuc}</p>
                      {cat.moTa && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cat.moTa}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{
                        color: 'var(--error)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8
                      }}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Tạo bài viết mới</h3>
              <form onSubmit={handleCreateBlog}>
                <div className="form-group">
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    value={blogForm.tieuDe}
                    onChange={(e) => setBlogForm({ ...blogForm, tieuDe: e.target.value })}
                    placeholder="Tiêu đề bài viết"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung</label>
                  <textarea
                    value={blogForm.noiDung}
                    onChange={(e) => setBlogForm({ ...blogForm, noiDung: e.target.value })}
                    rows={6}
                    placeholder="Nội dung bài viết..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL hình ảnh</label>
                  <input
                    type="text"
                    value={blogForm.hinhAnhDaiDien}
                    onChange={(e) => setBlogForm({ ...blogForm, hinhAnhDaiDien: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Đăng bài viết
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Tất cả bài viết ({blogs.length})</h3>
              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {blogs.map(blog => (
                  <div key={blog.id} style={{
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {blog.tieuDe}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {new Date(blog.ngayTao).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link to={`/blogs/${blog.id}`} style={{ color: 'var(--text-muted)', padding: 6 }}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          style={{
                            color: 'var(--error)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 6
                          }}
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
