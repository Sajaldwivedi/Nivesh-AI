import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/stocks', label: 'Stocks' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/history', label: 'History' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Sign Up' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-700/50 shadow-2xl shadow-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            to="/"
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <BrandLogo />
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative transition-colors duration-300 ${
                    isActive
                      ? 'text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                      : 'text-slate-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-200">
                  <span className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-center leading-7 text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  {user?.name}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
