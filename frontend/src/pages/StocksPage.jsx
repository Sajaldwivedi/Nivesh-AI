import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import StockCard from '../components/StockCard';
import BuyStockModal from '../components/BuyStockModal';
import { usePortfolio } from '../contexts/PortfolioContext';
import { stockAPI } from '../services/api';

const StocksPage = () => {
  const { stocks, fetchStocks, fetchPortfolio } = usePortfolio();
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      // Initialize stocks if not done
      try {
        await stockAPI.initializeStocks();
      } catch (error) {
        console.log('Stocks already initialized');
      }
      await fetchStocks();
      setLoading(false);
    };
    loadStocks();
  }, []);

  // Refresh stock prices every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await stockAPI.simulatePriceFeed();
        if (response.data && response.data.stocks) {
          // Update stocks in context or local state
          await fetchStocks();
        }
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleBuySuccess = async () => {
    await fetchPortfolio();
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading stocks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer />
      <Header
        title="Stock Market"
        subtitle="Browse and buy stocks in real-time"
      />

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Stock Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <StockCard
              key={stock._id}
              stock={stock}
              onBuy={setSelectedStock}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No stocks found
          </p>
        )}
      </div>

      {/* Buy Modal */}
      {selectedStock && (
        <BuyStockModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={handleBuySuccess}
        />
      )}
    </div>
  );
};

export default StocksPage;
