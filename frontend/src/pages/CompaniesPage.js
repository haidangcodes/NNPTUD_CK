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

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.tenCongTy?.toLowerCase().includes(search.toLowerCase()) ||
      company.moTa?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'ĐƯỢC_DUYỆT': 'active',
    'CHỜ_XỬ_LÝ': 'pending',
    'BỊ_TỪ_CHỐI': 'rejected',
    'BỊ_KHÓA': 'rejected'
  };

  const statusLabels = {
    'ĐƯỢC_DUYỆT': 'Đã duyệt',
    'CHỜ_XỬ_LÝ': 'Chờ duyệt',
    'BỊ_TỪ_CHỐI': 'Từ chối',
    'BỊ_KHÓA': 'Bị khóa'
  };

  return (
    <div className="companies-page">
      <div className="page-header">
        <div className="container">
          <h1>Các công ty đối tác</h1>
          <p>Khám phá những doanh nghiệp hàng đầu đang tuyển dụng</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm công ty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn btn-primary">Tìm kiếm</button>
        </div>

        <div className="filter-bar">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'ĐƯỢC_DUYỆT', label: 'Đã duyệt' },
            { value: 'CHỜ_XỬ_LÝ', label: 'Chờ duyệt' }
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`btn ${statusFilter === status.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              {status.label}
            </button>
          ))}
          <span className="count">{filteredCompanies.length} công ty</span>
        </div>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card" style={{ height: 280 }} />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3>Không tìm thấy công ty</h3>
            <p>Thử điều chỉnh từ khóa tìm kiếm</p>
            <button onClick={() => { setSearch(''); setStatusFilter('all'); }} className="btn btn-ghost">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {filteredCompanies.map((company, index) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="company-card animate-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="logo">{company.tenCongTy?.[0] || 'C'}</div>
                <h3>{company.tenCongTy}</h3>
                <p className="description">{company.moTa?.substring(0, 100)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <span className={`status ${statusColors[company.trangThai] || 'closed'}`}>
                    {statusLabels[company.trangThai] || company.trangThai}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
