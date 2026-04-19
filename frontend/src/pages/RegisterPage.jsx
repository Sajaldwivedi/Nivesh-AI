import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Registration successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error(result.error);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

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
            <p className="text-slate-400 text-sm">Start Your Trading Journey Today</p>
          </div>

          {/* Form Card */}
          <div className={`card-premium p-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Create Account
            </h1>
            <p className="text-slate-300 text-center mb-8 font-light">
              Join thousands of traders learning with Nivesh AI
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="group">
                <label className="block text-slate-300 mb-2 font-medium text-sm">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">👤</span>
                </div>
              </div>

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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">🔒</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 text-xs">
                    <div className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formData.password.length >= 6 ? '✓' : '○'} At least 6 characters
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block text-slate-300 mb-2 font-medium text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">✔️</span>
                  {formData.confirmPassword && (
                    <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordsMatch ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-8 font-semibold py-3 relative overflow-hidden group"
              >
                <span className={`transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  Create Account →
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

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                >
                  Sign in now
                </Link>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>⚡ Fast</span>
              <span>•</span>
              <span>✓ Safe</span>
            </div>
          </div>

          {/* Features Highlight */}
          <div className={`mt-8 grid grid-cols-3 gap-3 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {[
              { icon: '💰', text: '₹100K Virtual' },
              { icon: '📈', text: 'Real Stocks' },
              { icon: '🎓', text: 'Learn Free' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-3 card text-xs">
                <div className="text-2xl mb-1">{feature.icon}</div>
                <p className="text-slate-300">{feature.text}</p>
              </div>
            ))}
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

export default RegisterPage;
