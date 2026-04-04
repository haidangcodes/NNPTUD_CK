import React, { useState, useEffect } from 'react';
import { companyService, categoryService, blogService } from '../services/api';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('companies');
  const [loading, setLoading] = useState(true);

  const [catForm, setCatForm] = useState({ name: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '' });

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
      setCategories(catRes.data.data || []);
      setBlogs(blogRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await companyService.approve(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await companyService.reject(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Xóa công ty?')) return;
    try {
      await companyService.delete(id);
      setCompanies(companies.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.create(catForm);
      setCatForm({ name: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xóa danh mục?')) return;
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await blogService.create(blogForm);
      setBlogForm({ title: '', content: '' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Xóa blog?')) return;
    try {
      await blogService.delete(id);
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard">
      <h1>Trang Quản Trị</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab('companies')} className={activeTab === 'companies' ? 'active' : ''}>
          Công ty ({companies.length})
        </button>
        <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>
          Danh mục ({categories.length})
        </button>
        <button onClick={() => setActiveTab('blogs')} className={activeTab === 'blogs' ? 'active' : ''}>
          Blog ({blogs.length})
        </button>
      </div>

      {activeTab === 'companies' && (
        <section className="tab-content">
          <h2>Quản lý Công ty</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(comp => (
                <tr key={comp._id}>
                  <td>{comp.name}</td>
                  <td>{comp.userId?.email}</td>
                  <td><span className={`status ${comp.status?.toLowerCase()}`}>{comp.status}</span></td>
                  <td>
                    {comp.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(comp._id)} className="btn btn-primary">Duyệt</button>
                        <button onClick={() => handleReject(comp._id)} className="btn btn-warning">Từ chối</button>
                      </>
                    )}
                    <button onClick={() => handleDeleteCompany(comp._id)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'categories' && (
        <section className="tab-content">
          <h2>Quản lý Danh mục</h2>
          <form onSubmit={handleCreateCategory} className="inline-form">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={catForm.name}
              onChange={e => setCatForm({ name: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Thêm</button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section className="tab-content">
          <h2>Quản lý Blog</h2>
          <form onSubmit={handleCreateBlog} className="blog-form">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={blogForm.title}
              onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Nội dung"
              value={blogForm.content}
              onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Đăng</button>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>
                    <button onClick={() => handleDeleteBlog(blog._id)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
