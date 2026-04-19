import React from 'react';

const BrandLogo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/25 bg-slate-950/70 shadow-lg shadow-orange-500/10">
        <svg
          viewBox="0 0 64 64"
          className="h-8 w-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nivesh-logo-line" x1="12" y1="52" x2="54" y2="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.55" stopColor="#F97316" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="nivesh-logo-bars" x1="18" y1="36" x2="44" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
          </defs>

          <path
            d="M12 42L24 34L33 38L44 24L52 18"
            stroke="url(#nivesh-logo-line)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 18L52 18L50.8 20.9"
            stroke="url(#nivesh-logo-line)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path d="M14 50V36L20 40V54L14 50Z" fill="url(#nivesh-logo-bars)" />
          <path d="M26 46V30L32 34V50L26 46Z" fill="url(#nivesh-logo-bars)" />
          <path d="M38 42V28L44 32V46L38 42Z" fill="url(#nivesh-logo-bars)" />
          <path d="M50 34V22L56 26V38L50 34Z" fill="url(#nivesh-logo-bars)" />
        </svg>
      </div>

      <div className="leading-none">
        <div className="text-[1.05rem] font-bold tracking-[0.18em] text-white">NIVESH AI</div>
        <div className="mt-1 text-[0.62rem] uppercase tracking-[0.34em] text-slate-400">Market Simulator</div>
      </div>
    </div>
  );
};

export default BrandLogo;