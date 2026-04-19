import React, { useEffect, useMemo, useState } from 'react';

import SellStockModal from '../components/SellStockModal';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';
import TinySparkline from '../components/TinySparkline';
import { buildMiniTrend, formatCurrency } from '../utils/marketData';

const PortfolioPage = () => {
  const { portfolio, stocks, fetchPortfolio, fetchStocks } = usePortfolio();
  const { user } = useAuth();
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      await Promise.all([fetchPortfolio(), fetchStocks()]);
      setLoading(false);
    };
    loadPortfolio();
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
        stockId: liveStock || holding.stockId,
        currentPrice,
        currentValue,
        gainLoss,
        gainLossPercent,
        trend: buildMiniTrend(currentPrice),
      };
    });
  }, [portfolio, stocks]);

  const summary = useMemo(() => {
    const totalInvested = portfolio?.totalInvested || 0;
    const totalCurrentValue = liveHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercent,
      holdingsCount: liveHoldings.length,
      cashBalance: user?.balance || 0,
    };
  }, [portfolio, liveHoldings, user]);

  const handleSellSuccess = async () => {
    await Promise.all([fetchPortfolio(), fetchStocks()]);
  };

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

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Total Invested</p>
          <p className="mt-3 text-3xl font-black text-blue-400">{formatCurrency(summary.totalInvested)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Current Value</p>
          <p className="mt-3 text-3xl font-black text-purple-400">{formatCurrency(summary.totalCurrentValue)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Unrealized P/L</p>
          <p className={`mt-3 text-3xl font-black ${summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(summary.totalGainLoss))}
          </p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Return %</p>
          <p className={`mt-3 text-3xl font-black ${summary.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] mb-10">
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Account Snapshot</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Capital overview</h2>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Cash balance</p>
              <p className="mt-1 text-2xl font-black text-green-400">{formatCurrency(summary.cashBalance)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Holdings</p>
              <p className="mt-2 text-2xl font-black text-white">{summary.holdingsCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Investment base</p>
              <p className="mt-2 text-2xl font-black text-blue-400">{formatCurrency(summary.totalInvested)}</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Growth</p>
              <p className={`mt-2 text-2xl font-black ${summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {summary.totalGainLoss >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Best Performer</p>
          {liveHoldings.length > 0 ? (
            (() => {
              const leader = [...liveHoldings].sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0];
              return (
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{leader.stockSymbol}</h3>
                      <p className="text-sm text-slate-400">{leader.quantity} shares</p>
                    </div>
                    <div className={`rounded-full px-4 py-2 text-sm font-semibold ${leader.gainLoss >= 0 ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>
                      {leader.gainLoss >= 0 ? '+' : ''}{leader.gainLossPercent.toFixed(2)}%
                    </div>
                  </div>
                  <TinySparkline data={leader.trend} positive={leader.gainLoss >= 0} />
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                      <p className="text-slate-500">Current</p>
                      <p className="mt-1 font-semibold">{formatCurrency(leader.currentPrice)}</p>
                    </div>
                    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                      <p className="text-slate-500">P/L</p>
                      <p className={`mt-1 font-semibold ${leader.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {leader.gainLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(leader.gainLoss))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="mt-5 text-sm text-slate-400">Buy a stock to populate the portfolio performance view.</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {liveHoldings.length > 0 ? (
          liveHoldings.map((holding) => {
            const positive = holding.gainLoss >= 0;

            return (
              <div key={holding._id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{holding.stockSymbol}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {holding.quantity} shares at {formatCurrency(holding.averageBuyPrice)} average
                    </p>
                  </div>
                  <div className={`text-right ${positive ? 'text-green-400' : 'text-red-400'}`}>
                    <p className="text-xl font-black">{positive ? '+' : ''}{formatCurrency(Math.abs(holding.gainLoss))}</p>
                    <p className="text-xs font-semibold">{positive ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Current value</p>
                    <p className="mt-2 text-2xl font-black text-blue-400">{formatCurrency(holding.currentValue)}</p>
                  </div>
                  <TinySparkline data={holding.trend} positive={positive} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                    <p className="text-slate-500">Invested</p>
                    <p className="mt-1 font-semibold text-white">{formatCurrency(holding.totalInvested)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                    <p className="text-slate-500">Price</p>
                    <p className="mt-1 font-semibold text-white">{formatCurrency(holding.currentPrice)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHolding(holding)}
                  className="btn btn-danger mt-5 w-full"
                >
                  Sell Position
                </button>
              </div>
            );
          })
        ) : (
          <div className="card col-span-full text-center">
            <p className="text-lg text-slate-300">You have not bought any stocks yet.</p>
            <a href="/stocks" className="btn btn-primary mt-5 inline-flex">
              Browse Stocks
            </a>
          </div>
        )}
      </div>

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
