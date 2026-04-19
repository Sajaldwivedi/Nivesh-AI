import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PortfolioCard from '../components/PortfolioCard';
import SellStockModal from '../components/SellStockModal';
import { usePortfolio } from '../contexts/PortfolioContext';

const PortfolioPage = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      await fetchPortfolio();
      setLoading(false);
    };
    loadPortfolio();
  }, []);

  const handleSellSuccess = async () => {
    await fetchPortfolio();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Header
        title="My Portfolio"
        subtitle="View and manage your stock holdings"
      />

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Total Invested</p>
            <p className="text-3xl font-bold text-blue-500">
              ₹{portfolio.totalInvested.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Current Value</p>
            <p className="text-3xl font-bold text-purple-500">
              ₹{portfolio.totalCurrentValue.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Total Gain/Loss</p>
            <p
              className={`text-3xl font-bold ${
                portfolio.totalGainLoss >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {portfolio.totalGainLoss >= 0 ? '+' : ''}₹
              {portfolio.totalGainLoss.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm mb-2">Return %</p>
            <p
              className={`text-3xl font-bold ${
                portfolio.totalGainLossPercent >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {portfolio.totalGainLossPercent >= 0 ? '+' : ''}
              {portfolio.totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Holdings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio && portfolio.holdings.length > 0 ? (
          portfolio.holdings.map((holding) => (
            <PortfolioCard
              key={holding._id}
              holding={holding}
              onSell={setSelectedHolding}
            />
          ))
        ) : (
          <div className="col-span-full text-center card">
            <p className="text-gray-400 text-lg mb-4">
              You haven't bought any stocks yet
            </p>
            <a href="/stocks" className="btn btn-primary">
              Browse Stocks
            </a>
          </div>
        )}
      </div>

      {/* Sell Modal */}
      {selectedHolding && (
        <SellStockModal
          holding={selectedHolding}
          onClose={() => setSelectedHolding(null)}
          onSuccess={handleSellSuccess}
        />
      )}
    </div>
  );
};

export default PortfolioPage;
