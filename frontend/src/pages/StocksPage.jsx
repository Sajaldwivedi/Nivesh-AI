import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import BuyStockModal from '../components/BuyStockModal';
import SellStockModal from '../components/SellStockModal';
import MarketCandlestickChart from '../components/MarketCandlestickChart';
import { usePortfolio } from '../contexts/PortfolioContext';
import { stockAPI } from '../services/api';
import { appendCandle, buildSeedCandles, formatCurrency, formatCompactNumber } from '../utils/marketData';

const StocksPage = () => {
  const { stocks, portfolio, fetchStocks, fetchPortfolio } = usePortfolio();
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [buyStock, setBuyStock] = useState(null);
  const [sellHolding, setSellHolding] = useState(null);
  const [chartData, setChartData] = useState({ candles: [], volumes: [] });
  const lastPriceRef = useRef(null);

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

  useEffect(() => {
    if (!selectedSymbol && stocks.length > 0) {
      setSelectedSymbol(stocks[0].symbol);
    }
  }, [stocks, selectedSymbol]);

  useEffect(() => {
    if (!selectedSymbol) {
      return undefined;
    }

    let isActive = true;

    const loadSelectedStock = async () => {
      setChartLoading(true);
      try {
        const response = await stockAPI.getStockBySymbol(selectedSymbol);

        if (!isActive) {
          return;
        }

        const stock = response.data.stock;
        setSelectedStock(stock);

        const seededSeries = buildSeedCandles(stock);
        setChartData(seededSeries);
        lastPriceRef.current = stock.currentPrice;
      } catch (error) {
        toast.error('Failed to load stock details');
      } finally {
        if (isActive) {
          setChartLoading(false);
        }
      }
    };

    loadSelectedStock();

    return () => {
      isActive = false;
    };
  }, [selectedSymbol]);

  useEffect(() => {
    if (!selectedSymbol || !selectedStock) {
      return;
    }

    const liveStock = stocks.find((stock) => stock.symbol === selectedSymbol);
    if (!liveStock) {
      return;
    }

    if (lastPriceRef.current == null) {
      lastPriceRef.current = liveStock.currentPrice;
      return;
    }

    if (Math.abs(liveStock.currentPrice - lastPriceRef.current) < 0.001) {
      return;
    }

    setSelectedStock((previous) => ({
      ...previous,
      ...liveStock,
    }));

    setChartData((previous) => appendCandle(previous.candles, previous.volumes, liveStock.currentPrice));
    lastPriceRef.current = liveStock.currentPrice;
  }, [stocks, selectedSymbol, selectedStock]);

  const filteredStocks = useMemo(
    () =>
      stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [stocks, searchTerm]
  );

  const selectedHolding = useMemo(() => {
    if (!portfolio || !selectedStock) {
      return null;
    }

    return portfolio.holdings.find((holding) => {
      const holdingId = holding.stockId?._id || holding.stockId;
      const stockId = selectedStock._id;
      return holding.stockSymbol === selectedStock.symbol || holdingId?.toString?.() === stockId?.toString?.();
    });
  }, [portfolio, selectedStock]);

  const priceChange = selectedStock && selectedStock.openPrice
    ? selectedStock.currentPrice - selectedStock.openPrice
    : 0;
  const changePercent = selectedStock && selectedStock.openPrice
    ? (priceChange / selectedStock.openPrice) * 100
    : 0;
  const isPositive = priceChange >= 0;

  const handleTradeSuccess = async () => {
    await fetchPortfolio();
    await fetchStocks();
  };

  const watchlistItemClass = (symbol) =>
    `group flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-all duration-300 ${
      selectedSymbol === symbol
        ? 'border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/10'
        : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-500/70 hover:bg-slate-800/60'
    }`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="card w-full max-w-md animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-slate-700/70" />
          <div className="h-10 rounded-xl bg-slate-700/50" />
          <div className="h-64 rounded-3xl bg-slate-700/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="card sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-hidden p-0">
          <div className="border-b border-slate-700/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Watchlist</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by symbol or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-4"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-3 pr-2 space-y-3">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => {
                const delta = stock.openPrice ? stock.currentPrice - stock.openPrice : 0;
                const deltaPercent = stock.openPrice ? (delta / stock.openPrice) * 100 : 0;
                const positive = delta >= 0;

                return (
                  <button
                    key={stock._id}
                    type="button"
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={watchlistItemClass(stock.symbol)}
                  >
                    <div className="flex items-start justify-between gap-3 text-left">
                      <div>
                        <p className="text-sm font-semibold tracking-wide text-white">{stock.symbol}</p>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">{stock.name}</p>
                      </div>
                      <div className={`text-right text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
                        <p>{formatCurrency(stock.currentPrice)}</p>
                        <p className="text-xs opacity-80">{positive ? '+' : ''}{deltaPercent.toFixed(2)}%</p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-8 text-center text-sm text-slate-400">No stocks found.</p>
            )}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="card overflow-hidden p-6 lg:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-black text-white">{selectedStock?.symbol || 'Select a stock'}</h2>
                  <span className="rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                    NSE
                  </span>
                  <span className="rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                    EQ
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">{selectedStock?.name || 'Choose a symbol from the watchlist to inspect live price movement, volume and trading actions.'}</p>
              </div>

              {selectedStock && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBuyStock(selectedStock)}
                    className="btn btn-success px-5 py-2.5"
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedHolding && setSellHolding(selectedHolding)}
                    disabled={!selectedHolding}
                    className="btn btn-danger px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sell
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Current Price</p>
                <p className="mt-2 text-3xl font-black text-white">{selectedStock ? formatCurrency(selectedStock.currentPrice) : '—'}</p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Day Change</p>
                <p className={`mt-2 text-3xl font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStock ? `${priceChange >= 0 ? '+' : ''}${formatCurrency(Math.abs(priceChange))}` : '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Return</p>
                <p className={`mt-2 text-3xl font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedStock ? `${priceChange >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Volume</p>
                <p className="mt-2 text-3xl font-black text-white">{selectedStock ? formatCompactNumber(selectedStock.volume) : '—'}</p>
              </div>
            </div>
          </div>

          <div className="card p-4 lg:p-6">
            {chartLoading ? (
              <div className="flex h-[420px] items-center justify-center text-slate-400">Loading chart...</div>
            ) : (
              <MarketCandlestickChart candles={chartData.candles} volumes={chartData.volumes} height={420} />
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Position</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">Selected stock summary</h3>
                </div>
                {selectedStock && (
                  <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isPositive ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>
                    {isPositive ? 'Bullish' : 'Bearish'} today
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Open</p>
                  <p className="mt-2 text-xl font-bold text-white">{selectedStock ? formatCurrency(selectedStock.openPrice) : '—'}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">High</p>
                  <p className="mt-2 text-xl font-bold text-white">{selectedStock ? formatCurrency(selectedStock.highPrice) : '—'}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Low</p>
                  <p className="mt-2 text-xl font-bold text-white">{selectedStock ? formatCurrency(selectedStock.lowPrice) : '—'}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Held</p>
                  <p className="mt-2 text-xl font-bold text-white">{selectedHolding ? selectedHolding.quantity : 0} shares</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-700/60 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-slate-900/40 p-5">
                <p className="text-sm text-slate-300">
                  {selectedStock
                    ? `Live trading is active for ${selectedStock.symbol}. Use the trade buttons above to buy or trim your position while prices update automatically.`
                    : 'Pick a stock from the watchlist to open its live market surface.'}
                </p>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Quick Actions</p>
              <div className="mt-5 space-y-4">
                <button
                  type="button"
                  onClick={() => selectedStock && setBuyStock(selectedStock)}
                  disabled={!selectedStock}
                  className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy selected stock
                </button>
                <button
                  type="button"
                  onClick={() => selectedHolding && setSellHolding(selectedHolding)}
                  disabled={!selectedHolding}
                  className="btn btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sell owned position
                </button>
              </div>

              <div className="mt-6 border-t border-slate-700/60 pt-5">
                <p className="text-sm text-slate-400">Portfolio balance</p>
                <p className="mt-2 text-2xl font-black text-green-400">{formatCurrency(portfolio?.totalInvested || 0)}</p>
                <p className="mt-1 text-xs text-slate-500">Invested capital on record</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {buyStock && (
        <BuyStockModal
          stock={buyStock}
          onClose={() => setBuyStock(null)}
          onSuccess={handleTradeSuccess}
        />
      )}

      {sellHolding && (
        <SellStockModal
          holding={sellHolding}
          onClose={() => setSellHolding(null)}
          onSuccess={handleTradeSuccess}
        />
      )}
    </div>
  );
};

export default StocksPage;
