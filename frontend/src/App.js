import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import InterviewPage from './pages/InterviewPage';
import ProfileEditPage from './pages/ProfileEditPage';
import CompanyEditPage from './pages/CompanyEditPage';
import NotFoundPage from './pages/NotFoundPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.vaiTro)) return <Navigate to="/" replace />;
  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  const getUserName = () => {
    if (!user) return '';
    return user.ho && user.ten ? `${user.ho} ${user.ten}` : user.email;
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.vaiTro) {
      case 'UNG_VIEN':
        return { to: '/dashboard/candidate', label: 'Dashboard' };
      case 'TUYEN_DUNG':
        return { to: '/dashboard/recruiter', label: 'Dashboard' };
      case 'QUAN_TRI':
        return { to: '/dashboard/admin', label: 'Admin' };
      default:
        return null;
    }
  };

  const dashLink = getDashboardLink();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <Link to="/">Job<span>Portal</span></Link>
        </div>
        <div className="nav-links">
          <Link to="/jobs">Việc làm</Link>
          <Link to="/companies">Công ty</Link>
          <Link to="/blogs">Blog</Link>
          {user && dashLink && (
            <>
              <Link to={dashLink.to}>{dashLink.label}</Link>
              <span className="user-name" style={{ marginLeft: 8 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {getUserName()}
              </span>
              <button onClick={logout} className="btn-logout">Đăng xuất</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register" className="btn-accent">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            <Route path="/dashboard/candidate" element={
              <ProtectedRoute roles={['UNG_VIEN']}>
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/recruiter" element={
              <ProtectedRoute roles={['TUYEN_DUNG']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={['QUAN_TRI']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/interviews" element={
              <ProtectedRoute roles={['UNG_VIEN', 'TUYEN_DUNG', 'QUAN_TRI']}>
                <InterviewPage />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute roles={['UNG_VIEN']}>
                <ProfileEditPage />
              </ProtectedRoute>
            } />
            <Route path="/company/edit" element={
              <ProtectedRoute roles={['TUYEN_DUNG']}>
                <CompanyEditPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
