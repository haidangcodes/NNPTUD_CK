import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService, categoryService, blogService } from '../services/api';

const HomePage = () => {
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
        blogService.getAll({ limit: 3 })
      ]);
      setJobs(jobsRes.data.data.jobs || []);
      setCategories(catsRes.data.data || []);
      setBlogs(blogsRes.data.data.blogs || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-400 tracking-[0.4em] text-sm uppercase mb-6">Find Your Dream Job</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Work that <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">matters</span>
          </h1>
          <p className="text-stone-400 text-lg max-w-xl mx-auto mb-12">
            Connect with top companies and discover opportunities that match your skills and ambitions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/30">
              Browse Jobs
            </Link>
            <Link to="/companies" className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl hover:bg-white/20 transition-all font-semibold border border-white/20">
              Explore Companies
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-600 tracking-wider text-sm uppercase mb-2">Browse by</p>
            <h2 className="text-3xl font-bold text-stone-900">Job Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat._id}
                to={`/jobs?category=${cat._id}`}
                className="group p-6 bg-stone-50 rounded-2xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 border border-stone-100 hover:border-amber-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  {cat.name?.[0] || '?'}
                </div>
                <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 tracking-wider text-sm uppercase mb-2">Latest</p>
              <h2 className="text-3xl font-bold text-stone-900">Recent Jobs</h2>
            </div>
            <Link to="/jobs" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2">
              View all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-amber-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {job.companyId?.name?.[0] || 'C'}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-stone-500 text-sm mb-3">{job.companyId?.name || 'Company'}</p>
                <div className="flex items-center gap-4 text-sm text-stone-400">
                  {job.salaryRange && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.salaryRange}
                    </span>
                  )}
                  {job.categoryId?.name && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {job.categoryId.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 tracking-wider text-sm uppercase mb-2">From our blog</p>
              <h2 className="text-3xl font-bold text-stone-900">Latest Articles</h2>
            </div>
            <Link to="/blogs" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2">
              Read all articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="group bg-stone-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 relative">
                  {blog.thumbnailUrl && (
                    <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-amber-600 uppercase tracking-wider mb-2">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
                  </p>
                  <h3 className="font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-3">
                    {blog.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of candidates who have found their dream jobs through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/30">
              Create Account
            </Link>
            <Link to="/jobs" className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl hover:bg-white/20 transition-all font-semibold border border-white/20">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">JobPortal</h3>
              <p className="text-sm">Connecting talent with opportunity</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link>
              <Link to="/companies" className="hover:text-white transition-colors">Companies</Link>
              <Link to="/blogs" className="hover:text-white transition-colors">Blog</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
            © 2024 JobPortal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
