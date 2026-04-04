import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-stone-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-4">Page Not Found</h1>
        <p className="text-stone-500 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-amber-500/25"
          >
            Back to Home
          </Link>
          <Link
            to="/jobs"
            className="px-8 py-3 bg-white text-stone-700 rounded-xl hover:bg-stone-100 transition-all font-medium border border-stone-200"
          >
            Browse Jobs
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-stone-400 text-sm mb-4">Or explore more</p>
          <div className="flex justify-center gap-6">
            <Link to="/companies" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Companies
            </Link>
            <Link to="/blogs" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Blog
            </Link>
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
