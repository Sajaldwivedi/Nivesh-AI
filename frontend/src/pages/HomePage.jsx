import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <Header
          title="Welcome to Nivesh AI"
          subtitle="Learn Stock Trading with a Virtual Portfolio"
        />

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Start Trading Today!
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Experience the stock market with a virtual balance of ₹100,000. Buy, sell, and manage your portfolio in real-time.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Real-time stock prices
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Buy and sell stocks instantly
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Track your portfolio performance
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                View transaction history
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Compete on leaderboards
              </li>
            </ul>
            <div className="flex gap-4">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">1. Create Account</p>
                  <p className="text-sm text-gray-200">Register with your email and get ₹100,000 virtual balance</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">2. Browse Stocks</p>
                  <p className="text-sm text-gray-200">View real-time stock prices and market data</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">3. Trade Stocks</p>
                  <p className="text-sm text-gray-200">Buy and sell stocks with your virtual portfolio</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">4. Monitor Performance</p>
                  <p className="text-sm text-gray-200">Track gains/losses and improve your strategy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="card text-center">
            <p className="text-5xl font-bold text-blue-500 mb-2">₹100,000</p>
            <p className="text-gray-400">Starting Virtual Balance</p>
          </div>
          <div className="card text-center">
            <p className="text-5xl font-bold text-green-500 mb-2">8+</p>
            <p className="text-gray-400">Real Stocks to Trade</p>
          </div>
          <div className="card text-center">
            <p className="text-5xl font-bold text-purple-500 mb-2">Real-Time</p>
            <p className="text-gray-400">Price Updates</p>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>© 2024 Nivesh AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
