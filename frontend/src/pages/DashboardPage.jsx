import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LineChartComponent, PieChartComponent } from '../components/Charts';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { portfolio, stocks, fetchPortfolio, fetchStocks } = usePortfolio();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPortfolio(), fetchStocks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const chartData = stocks.slice(0, 5).map((stock) => ({
    name: stock.symbol,
    value: stock.currentPrice,
  }));

  const portfolioData =
    portfolio && portfolio.holdings.length > 0
      ? portfolio.holdings.map((h) => ({
        name: h.stockSymbol,
        value: parseFloat(h.currentValue.toFixed(2)),
      }))
      : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your portfolio overview"
      />

      {/* Balance Card */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Account Balance</p>
          <p className="text-4xl font-bold text-green-500">₹{user?.balance.toFixed(2)}</p>
        </div>

        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Total Investment</p>
          <p className="text-4xl font-bold text-blue-500">
            ₹{portfolio?.totalInvested.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Current Portfolio Value</p>
          <p className="text-4xl font-bold text-purple-500">
            ₹{portfolio?.totalCurrentValue.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Gain/Loss Card */}
      <div className="mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Overall Performance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Gain/Loss</p>
              <p
                className={`text-5xl font-bold ${
                  portfolio?.totalGainLoss >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {portfolio?.totalGainLoss >= 0 ? '+' : ''}₹
                {portfolio?.totalGainLoss.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Return Percentage</p>
              <p
                className={`text-5xl font-bold ${
                  portfolio?.totalGainLossPercent >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {portfolio?.totalGainLossPercent >= 0 ? '+' : ''}
                {portfolio?.totalGainLossPercent.toFixed(2) || '0.00'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {chartData.length > 0 && (
          <LineChartComponent
            data={chartData}
            title="Top 5 Stock Prices"
          />
        )}
        {portfolioData.length > 0 && (
          <PieChartComponent
            data={portfolioData}
            title="Portfolio Distribution"
          />
        )}
      </div>

      {/* Holdings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Holdings</h2>
        {portfolio && portfolio.holdings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Avg Buy Price</th>
                  <th className="text-right py-3 px-4">Current Value</th>
                  <th className="text-right py-3 px-4">Gain/Loss</th>
                  <th className="text-right py-3 px-4">Return %</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((holding) => (
                  <tr
                    key={holding._id}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {holding.stockSymbol}
                    </td>
                    <td className="text-right py-3 px-4">{holding.quantity}</td>
                    <td className="text-right py-3 px-4">
                      ₹{holding.averageBuyPrice.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      ₹{holding.currentValue.toFixed(2)}
                    </td>
                    <td
                      className={`text-right py-3 px-4 font-semibold ${
                        holding.gainLoss >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {holding.gainLoss >= 0 ? '+' : ''}₹
                      {holding.gainLoss.toFixed(2)}
                    </td>
                    <td
                      className={`text-right py-3 px-4 font-semibold ${
                        holding.gainLossPercent >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {holding.gainLossPercent >= 0 ? '+' : ''}
                      {holding.gainLossPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No holdings yet. Start by buying some stocks!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
