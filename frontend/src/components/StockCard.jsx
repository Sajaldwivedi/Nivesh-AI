import React from 'react';

const StockCard = ({ stock, onBuy }) => {
  const priceChangePercent = stock.openPrice && stock.openPrice > 0 
    ? ((stock.currentPrice - stock.openPrice) / stock.openPrice * 100).toFixed(2) 
    : '0';
  const isPositive = parseFloat(priceChangePercent) >= 0;

  return (
    <div className="card hover:bg-gray-850 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
          <p className="text-gray-400 text-sm">{stock.name}</p>
        </div>
        <div className={`text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <p className="text-2xl font-bold">₹{stock.currentPrice.toFixed(2)}</p>
          <p className="text-sm">{isPositive ? '+' : ''}{priceChangePercent}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-700">
        <div>
          <p className="text-gray-400 text-xs">Open</p>
          <p className="text-white font-semibold">₹{stock.openPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">High/Low</p>
          <p className="text-white font-semibold">₹{stock.highPrice.toFixed(2)}/₹{stock.lowPrice.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => onBuy(stock)}
        className="btn btn-primary w-full"
      >
        Buy Stock
      </button>
    </div>
  );
};

export default StockCard;
