import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBlogs();
  }, [page]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogService.getAll({ page, limit: 6 });
      setBlogs(res.data.data.blogs || []);
      setTotalPages(res.data.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="blogs-page min-h-screen bg-stone-50">
      <div className="relative overflow-hidden bg-stone-900 text-white py-24 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rotate-45" />
          <div className="absolute bottom-10 right-20 w-96 h-96 border border-white/10 rotate-12" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4">Stories & Insights</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            The Journal
          </h1>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Career advice, industry insights, and stories from our community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-stone-800 placeholder-stone-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  page === p
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
                  {blog.thumbnailUrl ? (
                    <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-amber-600 uppercase tracking-wider mb-2">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-serif font-semibold text-stone-800 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-3 mb-4">
                    {blog.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-medium">
                      {blog.authorId?.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <span className="text-sm text-stone-600">{blog.authorId?.email}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-stone-700 mb-2">No articles found</h3>
            <p className="text-stone-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
