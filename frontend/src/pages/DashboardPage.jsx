import React, { useEffect, useMemo, useState } from 'react';

import { LineChartComponent, PieChartComponent } from '../components/Charts';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/marketData';

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

  const liveHoldings = useMemo(() => {
    if (!portfolio?.holdings?.length) {
      return [];
    }

    return portfolio.holdings.map((holding) => {
      const holdingStockId = holding.stockId?._id || holding.stockId;
      const liveStock = stocks.find(
        (stock) => stock._id === holdingStockId || stock.symbol === holding.stockSymbol
      );
      const currentPrice = liveStock?.currentPrice ?? holding.stockId?.currentPrice ?? holding.averageBuyPrice;
      const currentValue = currentPrice * holding.quantity;
      const gainLoss = currentValue - holding.totalInvested;
      const gainLossPercent = holding.totalInvested > 0 ? (gainLoss / holding.totalInvested) * 100 : 0;

      return {
        ...holding,
        currentPrice,
        currentValue,
        gainLoss,
        gainLossPercent,
      };
    });
  }, [portfolio, stocks]);

  const totals = useMemo(() => {
    const totalInvested = portfolio?.totalInvested || 0;
    const totalCurrentValue = liveHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return { totalInvested, totalCurrentValue, totalGainLoss, totalGainLossPercent };
  }, [portfolio, liveHoldings]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="card w-full max-w-md animate-pulse space-y-4">
          <div className="h-4 w-48 rounded bg-slate-700/70" />
          <div className="h-16 rounded-2xl bg-slate-700/40" />
          <div className="h-64 rounded-3xl bg-slate-700/30" />
        </div>
      </div>
    );
  }

  const chartData = stocks.slice(0, 5).map((stock) => ({
    name: stock.symbol,
    value: stock.currentPrice,
  }));

  const portfolioData =
    liveHoldings.length > 0
      ? liveHoldings.map((holding) => ({
          name: holding.stockSymbol,
          value: parseFloat(holding.currentValue.toFixed(2)),
        }))
      : [];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Account Balance</p>
          <p className="mt-3 text-4xl font-black text-green-400">{formatCurrency(user?.balance || 0)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Invested</p>
          <p className="mt-3 text-4xl font-black text-blue-400">{formatCurrency(totals.totalInvested)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Current Value</p>
          <p className="mt-3 text-4xl font-black text-purple-400">{formatCurrency(totals.totalCurrentValue)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Return</p>
          <p className={`mt-3 text-4xl font-black ${totals.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totals.totalGainLoss >= 0 ? '+' : ''}{totals.totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mb-10">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Overall Performance</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Gain/Loss</p>
              <p className={`text-5xl font-bold ${totals.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totals.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(totals.totalGainLoss))}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Return Percentage</p>
              <p className={`text-5xl font-bold ${totals.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totals.totalGainLossPercent >= 0 ? '+' : ''}{totals.totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {chartData.length > 0 && (
          <LineChartComponent data={chartData} title="Top 5 Stock Prices" />
        )}
        {portfolioData.length > 0 && (
          <PieChartComponent data={portfolioData} title="Portfolio Distribution" />
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="border-b border-slate-700/60 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">Your Holdings</h2>
        </div>
        {liveHoldings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-900/70">
                <tr className="border-b border-slate-700/60 text-xs uppercase tracking-[0.28em] text-slate-400">
                  <th className="px-5 py-4 text-left font-semibold">Stock</th>
                  <th className="px-5 py-4 text-right font-semibold">Quantity</th>
                  <th className="px-5 py-4 text-right font-semibold">Avg Buy</th>
                  <th className="px-5 py-4 text-right font-semibold">Current Value</th>
                  <th className="px-5 py-4 text-right font-semibold">Gain/Loss</th>
                  <th className="px-5 py-4 text-right font-semibold">Return %</th>
                </tr>
              </thead>
              <tbody>
                {liveHoldings.map((holding) => (
                  <tr key={holding._id} className="border-b border-slate-800/70 text-slate-200 hover:bg-slate-800/40">
                    <td className="px-5 py-4 font-semibold text-white">{holding.stockSymbol}</td>
                    <td className="px-5 py-4 text-right">{holding.quantity}</td>
                    <td className="px-5 py-4 text-right">{formatCurrency(holding.averageBuyPrice)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-white">{formatCurrency(holding.currentValue)}</td>
                    <td className={`px-5 py-4 text-right font-semibold ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.gainLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(holding.gainLoss))}
                    </td>
                    <td className={`px-5 py-4 text-right font-semibold ${holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-8 text-slate-400">No holdings yet. Start by buying some stocks!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
