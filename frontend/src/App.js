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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">JobPortal</Link>
      </div>
      <div className="nav-links">
        <Link to="/jobs">Việc làm</Link>
        <Link to="/companies">Công ty</Link>
        <Link to="/blogs">Blog</Link>
        {user ? (
          <>
            {user.role === 'CANDIDATE' && <Link to="/dashboard/candidate">Dashboard</Link>}
            {user.role === 'RECRUITER' && <Link to="/dashboard/recruiter">Dashboard</Link>}
            {user.role === 'ADMIN' && <Link to="/dashboard/admin">Admin</Link>}
            <button onClick={logout} className="btn btn-logout">Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            <Route path="/dashboard/candidate" element={
              <ProtectedRoute roles={['CANDIDATE']}>
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/recruiter" element={
              <ProtectedRoute roles={['RECRUITER']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/interviews" element={
              <ProtectedRoute roles={['CANDIDATE', 'RECRUITER', 'ADMIN']}>
                <InterviewPage />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute roles={['CANDIDATE']}>
                <ProfileEditPage />
              </ProtectedRoute>
            } />
            <Route path="/company/edit" element={
              <ProtectedRoute roles={['RECRUITER']}>
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
