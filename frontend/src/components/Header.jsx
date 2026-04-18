import React from 'react';

const Header = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
    {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
  </div>
);

export default Header;
