import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-700/50 shadow-2xl shadow-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/" 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
              bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
          >
            💹 Nivesh AI
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-300
                    relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 
                    after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 
                    after:transition-all after:duration-300 hover:after:w-full"
                >
                  Dashboard
                </Link>
                <Link
                  to="/stocks"
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-300
                    relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 
                    after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 
                    after:transition-all after:duration-300 hover:after:w-full"
                >
                  Stocks
                </Link>
                <Link
                  to="/portfolio"
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-300
                    relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 
                    after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 
                    after:transition-all after:duration-300 hover:after:w-full"
                >
                  Portfolio
                </Link>
                <Link
                  to="/history"
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-300
                    relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 
                    after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 
                    after:transition-all after:duration-300 hover:after:w-full"
                >
                  History
                </Link>
                <span className="text-slate-400 text-sm font-semibold px-3 py-1 rounded-full 
                  bg-slate-800/50 border border-slate-700/50">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm px-5 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm px-5 py-2">
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
