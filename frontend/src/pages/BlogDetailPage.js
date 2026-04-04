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
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await blogService.delete(id);
      navigate('/blogs');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-stone-700 mb-4">{error || 'Article not found'}</h2>
          <Link to="/blogs" className="text-amber-600 hover:text-amber-700">← Back to articles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page min-h-screen bg-stone-50">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All articles
        </Link>

        <header className="mb-12">
          <p className="text-amber-600 tracking-wider text-sm uppercase mb-4">
            {new Date(blog.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium">
              {blog.authorId?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-medium text-stone-800">{blog.authorId?.email}</p>
              <p className="text-sm text-stone-500">Author</p>
            </div>
            {user && (user.role === 'ADMIN' || user.id === blog.authorId?._id) && (
              <button
                onClick={handleDelete}
                className="ml-auto text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </header>

        {blog.thumbnailUrl && (
          <div className="rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-80 object-cover" />
          </div>
        )}

        <div className="prose prose-stone max-w-none">
          <div className="text-lg leading-relaxed text-stone-700 whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
