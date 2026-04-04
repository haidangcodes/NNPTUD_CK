import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await companyService.getAll();
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(search.toLowerCase()) ||
                         company.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    APPROVED: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REJECTED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="companies-page min-h-screen bg-stone-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-6">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 tracking-[0.3em] text-sm uppercase mb-4">Trusted Partners</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Our Companies
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Discover leading organizations hiring top talent
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-stone-800 placeholder-stone-400 shadow-sm"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            {['all', 'APPROVED', 'PENDING'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <div
                key={company._id}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-stone-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 overflow-hidden">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      company.name?.[0] || 'C'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-stone-800 truncate group-hover:text-emerald-600 transition-colors">
                      {company.name}
                    </h3>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-500 transition-colors truncate block">
                      {company.website || 'No website'}
                    </a>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[company.status] || 'bg-stone-100 text-stone-600'}`}>
                    {company.status}
                  </span>
                </div>

                <p className="text-stone-500 text-sm mb-4 line-clamp-3">
                  {company.description || 'No description available'}
                </p>

                <div className="flex items-center gap-2 text-sm text-stone-400 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{company.address || 'Location not specified'}</span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-stone-100">
                  <Link
                    to={`/companies/${company._id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-lg transition-all duration-300"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/jobs?company=${company._id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-stone-600 hover:text-white bg-stone-100 hover:bg-stone-600 rounded-lg transition-all duration-300"
                  >
                    View Jobs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCompanies.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No companies found</h3>
            <p className="text-stone-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
