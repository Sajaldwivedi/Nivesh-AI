import React from 'react';

const TinySparkline = ({ data = [], positive = true }) => {
  if (!data.length) {
    return null;
  }

  const width = 120;
  const height = 36;
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28 overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? '#22c55e' : '#ef4444'}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      <defs>
        <linearGradient id="spark-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={positive ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)'} />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#spark-gradient)"
        stroke="none"
        points={`0,${height} ${points} ${width},${height}`}
      />
    </svg>
  );
};

export default TinySparkline;