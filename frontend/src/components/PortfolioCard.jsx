import React from 'react';

const PortfolioCard = ({ holding, onSell }) => {
  const gainLossColor = holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{holding.stockSymbol}</h3>
          <p className="text-gray-400 text-sm">{holding.quantity} shares @ ₹{holding.averageBuyPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-500">₹{holding.currentValue.toFixed(2)}</p>
          <p className={`text-sm font-semibold ${gainLossColor}`}>
            {holding.gainLoss >= 0 ? '+' : ''}₹{holding.gainLoss.toFixed(2)} ({holding.gainLossPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-700">
        <div>
          <p className="text-gray-400 text-xs">Invested</p>
          <p className="text-white font-semibold">₹{holding.totalInvested.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Current</p>
          <p className="text-white font-semibold">₹{holding.currentValue.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => onSell(holding)}
        className="btn btn-danger w-full"
      >
        Sell Stock
      </button>
    </div>
  );
};

export default PortfolioCard;
