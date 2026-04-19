import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const HomePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const steps = [
    { step: '1', title: 'Create Account', description: 'Register with your email and get ₹100,000 virtual balance instantly' },
    { step: '2', title: 'Browse Stocks', description: 'View real-time stock prices and advanced market data' },
    { step: '3', title: 'Trade Stocks', description: 'Buy and sell stocks with your virtual portfolio seamlessly' },
    { step: '4', title: 'Monitor Performance', description: 'Track gains/losses and optimize your trading strategy' },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-floatUp"></div>
        <div className="absolute top-60 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-floatUp" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-floatUp" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className={`mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Header
                title="Welcome to Nivesh AI"
                subtitle="Master the Stock Market with AI-Powered Paper Trading • Learn • Practice • Dominate"
              />
            </div>

            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
              {/* Left Content */}
              <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Paper Trading Platform
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      for Every Trader
                    </span>
                  </h2>

                  <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-lg">
                    Experience the stock market with a risk-free virtual portfolio of ₹100,000. Perfect for beginners and seasoned traders alike to refine their strategies.
                  </p>
                </div>

                {/* Features List - Better Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
                  {[
                    { icon: '⚡', title: 'Real-Time', desc: 'Live Prices' },
                    { icon: '🎯', title: 'Instant', desc: 'Trading' },
                    { icon: '📊', title: 'Analytics', desc: 'Tools' },
                    { icon: '🏆', title: 'Compete', desc: 'Leaderboards' },
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className={`card p-4 sm:p-6 group cursor-pointer hover:shadow-lg hover:shadow-blue-500/40 
                        transform hover:scale-105 transition-all duration-300 ${
                          isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      style={{ transitionDelay: isLoaded ? `${100 + idx * 100}ms` : '0ms' }}
                    >
                      <div className="text-2xl sm:text-3xl mb-2 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                      <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                  <Link 
                    to="/register" 
                    className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 
                      shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 animate-glowPulse 
                      text-center whitespace-nowrap"
                  >
                    Get Started Free →
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-center whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Right - Stats & Quick Info */}
              <div className={`space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="glass p-6 sm:p-8 space-y-6">
                  <div className="text-center py-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
                    <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ₹100K
                    </div>
                    <p className="text-slate-300 mt-3 font-semibold text-sm sm:text-base">Virtual Balance</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Stocks', value: '8+', color: 'text-green-400' },
                      { label: 'Updates', value: 'Live', color: 'text-blue-400' },
                      { label: 'Risk', value: 'Zero', color: 'text-yellow-400' },
                    ].map((stat, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-4 bg-slate-800/50 rounded-xl 
                          border border-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/70 
                          transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: isLoaded ? `${600 + idx * 100}ms` : '0ms' }}
                      >
                        <span className="text-slate-300 text-sm sm:text-base">{stat.label}</span>
                        <span className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works - Teleprompter Style Animation */}
            <div className="mb-32">
              <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                  How It Works
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-slate-300">
                  Get started in minutes with our intuitive onboarding process
                </p>
              </div>

              <div className="card-premium p-0 overflow-hidden">
                {/* Steps Container - Fixed for proper arrangement */}
                <div className="relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 overflow-hidden">
                  {/* Moving highlight bar */}
                  <div 
                    className="absolute left-0 right-0 bg-gradient-to-b from-blue-500/40 via-blue-500/60 to-blue-500/40 
                      pointer-events-none z-20 transition-all duration-700 ease-in-out shadow-lg shadow-blue-500/60"
                    style={{
                      top: `${activeStep * 25}%`,
                      height: '25%',
                    }}
                  ></div>

                  {/* Steps - Fixed layout */}
                  <div className="relative z-10">
                    {steps.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`min-h-24 p-6 sm:p-8 border-b border-slate-700/50 flex items-center gap-4 sm:gap-6 
                          transition-all duration-500 cursor-pointer last:border-b-0
                          ${activeStep === idx ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'hover:bg-slate-700/20'}
                        `}
                        onClick={() => setActiveStep(idx)}
                      >
                        <div className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                          flex items-center justify-center font-black text-2xl sm:text-3xl
                          transition-all duration-500
                          ${activeStep === idx 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/60' 
                            : 'bg-slate-800/70 text-slate-400'}`}
                        >
                          {item.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg sm:text-2xl font-bold transition-colors duration-300 ${
                            activeStep === idx ? 'text-blue-300' : 'text-slate-300'
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-slate-300 text-xs sm:text-base mt-1 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className={`text-2xl sm:text-3xl flex-shrink-0 transition-transform duration-500 hidden sm:block ${
                          activeStep === idx ? 'rotate-0 scale-110' : 'rotate-90 scale-75'
                        }`}>
                          →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="p-4 sm:p-6 bg-slate-900/70 flex gap-2 sm:gap-3 justify-center items-center">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                        activeStep === idx 
                          ? 'w-10 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'w-3 bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Step ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Key Benefits Section */}
            <div className="mb-32">
              <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-12 sm:mb-16">
                  Why Choose Nivesh AI?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      icon: '🎓',
                      title: 'Learn Risk-Free',
                      desc: 'Practice trading strategies without risking real money',
                      gradient: 'from-blue-600/20 to-blue-600/5'
                    },
                    {
                      icon: '📈',
                      title: 'Real Market Data',
                      desc: 'Trade with actual stock prices and market conditions',
                      gradient: 'from-purple-600/20 to-purple-600/5'
                    },
                    {
                      icon: '🚀',
                      title: 'Fast Execution',
                      desc: 'Instant order execution and real-time portfolio tracking',
                      gradient: 'from-pink-600/20 to-pink-600/5'
                    },
                  ].map((benefit, idx) => (
                    <div 
                      key={idx}
                      className={`card p-6 sm:p-8 group hover:shadow-2xl hover:shadow-blue-500/30 
                        transition-all duration-300 bg-gradient-to-br ${benefit.gradient} 
                        border-2 border-transparent hover:border-blue-500/50 transform hover:scale-105 
                        ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transitionDelay: isLoaded ? `${800 + idx * 100}ms` : '0ms' }}
                    >
                      <div className="text-5xl sm:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className={`relative card-premium p-8 sm:p-12 md:p-16 text-center overflow-hidden 
              transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Start Trading?
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Join thousands of traders learning and practicing with Nivesh AI today
                </p>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 
                    inline-block shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 animate-glowPulse"
                >
                  Start Trading Now →
                </Link>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-slate-400 text-xs sm:text-sm mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-800/50">
              <p>© 2026 Nivesh AI. All rights reserved. | Premium Paper Trading Platform</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
