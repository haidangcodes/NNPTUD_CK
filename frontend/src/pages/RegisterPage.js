import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CANDIDATE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'CANDIDATE', label: 'Candidate', desc: 'Looking for jobs', icon: '👤' },
    { value: 'RECRUITER', label: 'Recruiter', desc: 'Hiring talent', icon: '🏢' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Create account</h1>
          <p className="text-stone-500 mt-2">Join JobPortal today</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400"
                placeholder="Min. 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((role) => (
                  <label
                    key={role.value}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.role === role.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2 block">{role.icon}</span>
                    <span className="font-medium text-stone-800 block">{role.label}</span>
                    <span className="text-xs text-stone-500">{role.desc}</span>
                    {formData.role === role.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-stone-400 text-sm mt-6">
          <Link to="/" className="hover:text-stone-600 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
