import React from 'react';

const Header = ({ title, subtitle }) => (
  <div className="mb-16 animate-fadeIn">
    <h1 className="text-6xl md:text-7xl font-black text-white mb-4 bg-gradient-to-r 
      from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
      {title}
    </h1>
    {subtitle && (
      <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);

export default Header;
