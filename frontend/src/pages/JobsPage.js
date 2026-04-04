import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, [searchParams]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.get('category')) params.categoryId = searchParams.get('category');
      if (searchParams.get('company')) params.companyId = searchParams.get('company');
      if (search) params.title = search;

      const res = await jobService.getAll(params);
      let jobsData = res.data.data.jobs || [];

      if (statusFilter !== 'all') {
        jobsData = jobsData.filter(j => j.status === statusFilter);
      }

      setJobs(jobsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set('title', search);
    } else {
      newParams.delete('title');
    }
    setSearchParams(newParams);
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    DRAFT: 'bg-amber-100 text-amber-700',
    CLOSED: 'bg-stone-100 text-stone-600'
  };

  return (
    <div className="jobs-page min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-8">Find Your Perfect Job</h1>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search jobs by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-4 pl-12 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800 placeholder-stone-400"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button type="submit" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/25">
              Search
            </button>
          </form>

          <div className="flex gap-2 mt-4">
            {['all', 'ACTIVE', 'DRAFT', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {status === 'all' ? 'All Jobs' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No jobs found</h3>
            <p className="text-stone-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setSearchParams({}); }} className="text-amber-600 hover:text-amber-700 font-medium">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-stone-500 mb-6">{jobs.length} jobs found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100 hover:border-amber-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {job.companyId?.name?.[0] || 'C'}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-stone-100 text-stone-600'}`}>
                      {job.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-stone-500 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.companyId?.name || 'Company'}
                    </p>
                    {job.companyId?.address && (
                      <p className="text-stone-400 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.companyId.address}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                    {job.categoryId?.name && (
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
                        {job.categoryId.name}
                      </span>
                    )}
                    {job.salaryRange && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salaryRange}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
