export const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

export const formatCompactNumber = (value) => {
  const number = Number(value || 0);

  if (Math.abs(number) >= 10000000) {
    return `${(number / 10000000).toFixed(2)}Cr`;
  }

  if (Math.abs(number) >= 100000) {
    return `${(number / 100000).toFixed(2)}L`;
  }

  if (Math.abs(number) >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toFixed(0);
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

export const buildSeedCandles = (stock, totalPoints = 36) => {
  const basePrice = Number(stock?.currentPrice || 100);
  const candles = [];
  const volumes = [];
  const startTime = Math.floor(Date.now() / 1000) - totalPoints * 60 * 5;
  let previousClose = Number(stock?.openPrice || basePrice * 0.98);

  for (let index = 0; index < totalPoints; index += 1) {
    const open = previousClose;
    const drift = randomBetween(-0.018, 0.018);
    const close = Math.max(1, open * (1 + drift));
    const high = Math.max(open, close) * (1 + randomBetween(0.002, 0.014));
    const low = Math.min(open, close) * (1 - randomBetween(0.002, 0.014));
    const time = startTime + index * 60 * 5;
    const volume = Math.floor(randomBetween(18000, 120000));

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });

    volumes.push({
      time,
      value: volume,
      color: close >= open ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)',
    });

    previousClose = close;
  }

  if (candles.length > 0) {
    candles[candles.length - 1] = {
      ...candles[candles.length - 1],
      close: Number(basePrice.toFixed(2)),
      high: Number(Math.max(candles[candles.length - 1].high, basePrice).toFixed(2)),
      low: Number(Math.min(candles[candles.length - 1].low, basePrice).toFixed(2)),
    };
  }

  return { candles, volumes };
};

export const appendCandle = (candles, volumes, nextPrice) => {
  const lastCandle = candles[candles.length - 1];
  const open = lastCandle ? lastCandle.close : nextPrice;
  const close = Number(nextPrice.toFixed(2));
  const high = Math.max(open, close) * 1.008;
  const low = Math.min(open, close) * 0.992;
  const time = lastCandle ? lastCandle.time + 60 * 5 : Math.floor(Date.now() / 1000);
  const nextVolume = Math.floor(randomBetween(25000, 140000));

  return {
    candles: [
      ...candles.slice(-59),
      {
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close,
      },
    ],
    volumes: [
      ...volumes.slice(-59),
      {
        time,
        value: nextVolume,
        color: close >= open ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)',
      },
    ],
  };
};

export const buildMiniTrend = (value, points = 8) => {
  const base = Number(value || 1);
  return Array.from({ length: points }, (_, index) => {
    const swing = randomBetween(-0.015, 0.015) * (index + 1);
    return Number((base * (1 + swing)).toFixed(2));
  });
};