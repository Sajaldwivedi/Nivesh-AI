import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Logged in successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-floatUp"></div>
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-floatUp" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-floatUp" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4">
        <div className="max-w-md mx-auto">
          {/* Logo/Brand */}
          <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block mb-2">
              💹 Nivesh AI
            </Link>
            <p className="text-slate-400 text-sm">Premium Paper Trading Platform</p>
          </div>

          {/* Form Card */}
          <div className={`card-premium p-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-slate-300 text-center mb-8 font-light">
              Sign in to your account to continue trading
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label className="block text-slate-300 mb-2 font-medium text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">✉️</span>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-slate-300 mb-2 font-medium text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">🔒</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-8 font-semibold py-3 relative overflow-hidden group"
              >
                <span className={`transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign In →
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-block animate-spin">⏳</span>
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
              <span className="text-slate-400 text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-gradient-to-l from-slate-700 to-transparent"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>⚡ Fast</span>
              <span>•</span>
              <span>✓ Reliable</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© 2026 Nivesh AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
