import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService, categoryService, blogService } from '../services/api';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('companies');
  const [loading, setLoading] = useState(true);

  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', thumbnailUrl: '' });
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
      setCategories(catRes.data.data || []);
      setBlogs(blogRes.data.data || []);
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
      showToast('Company approved');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await companyService.reject(id);
      showToast('Company rejected');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await companyService.delete(id);
      showToast('Company deleted');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.create(catForm);
      setCatForm({ name: '', description: '' });
      showToast('Category created');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryService.delete(id);
      showToast('Category deleted');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await blogService.create(blogForm);
      setBlogForm({ title: '', content: '', thumbnailUrl: '' });
      showToast('Blog post created');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await blogService.delete(id);
      showToast('Blog deleted');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const statusColors = {
    APPROVED: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingCompanies = companies.filter(c => c.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-stone-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-slate-400">Manage the platform</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {[
            { key: 'companies', label: 'Companies', count: companies.length, highlight: pendingCompanies > 0 },
            { key: 'categories', label: 'Categories', count: categories.length },
            { key: 'blogs', label: 'Blog', count: blogs.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30'
                  : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-stone-100'
              }`}>
                {tab.count}
              </span>
              {tab.highlight && activeTab !== tab.key && (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'companies' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-800">Company Management</h2>
              {pendingCompanies > 0 && (
                <p className="text-amber-600 text-sm mt-1">{pendingCompanies} companies awaiting approval</p>
              )}
            </div>
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {companies.map(comp => (
                  <tr key={comp._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {comp.name?.[0] || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">{comp.name}</p>
                          <p className="text-xs text-stone-400">{comp.address || 'No address'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-sm">{comp.userId?.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[comp.status]}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {comp.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(comp._id)}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(comp._id)}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCompany(comp._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Add Category</h2>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="e.g. Technology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Optional description"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium"
                >
                  Create Category
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-bold text-stone-800">All Categories ({categories.length})</h2>
              </div>
              <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                {categories.map(cat => (
                  <div key={cat._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-800">{cat.name}</p>
                      {cat.description && <p className="text-xs text-stone-400">{cat.description}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Create Blog Post</h2>
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Blog title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                    placeholder="Write your blog content..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={blogForm.thumbnailUrl}
                    onChange={(e) => setBlogForm({ ...blogForm, thumbnailUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium"
                >
                  Publish Post
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-bold text-stone-800">All Posts ({blogs.length})</h2>
              </div>
              <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
                {blogs.map(blog => (
                  <div key={blog._id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-stone-800 truncate">{blog.title}</h3>
                        <p className="text-xs text-stone-400 mt-1">
                          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/blogs/${blog._id}`} className="text-slate-400 hover:text-slate-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-400 hover:text-red-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
