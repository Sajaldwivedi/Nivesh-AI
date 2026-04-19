import React, { useEffect, useMemo, useState } from 'react';

import { tradeAPI } from '../services/api';
import { formatCurrency } from '../utils/marketData';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const response = await tradeAPI.getTransactionHistory(page, 15);
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [page]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const summary = useMemo(() => {
    const buyCount = transactions.filter((transaction) => transaction.type === 'BUY').length;
    const sellCount = transactions.filter((transaction) => transaction.type === 'SELL').length;
    const turnover = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);

    return { buyCount, sellCount, turnover };
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="card w-full max-w-md animate-pulse space-y-4">
          <div className="h-4 w-44 rounded bg-slate-700/70" />
          <div className="h-10 rounded-xl bg-slate-700/50" />
          <div className="h-64 rounded-3xl bg-slate-700/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Buy Orders</p>
          <p className="mt-3 text-3xl font-black text-green-400">{summary.buyCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Sell Orders</p>
          <p className="mt-3 text-3xl font-black text-red-400">{summary.sellCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Turnover</p>
          <p className="mt-3 text-3xl font-black text-blue-400">{formatCurrency(summary.turnover)}</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900/70">
                  <tr className="border-b border-slate-700/60 text-left text-xs uppercase tracking-[0.28em] text-slate-400">
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 text-right font-semibold">Qty</th>
                    <th className="px-5 py-4 text-right font-semibold">Price</th>
                    <th className="px-5 py-4 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-slate-800/70 text-slate-200 transition-colors duration-200 hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4 text-sm text-slate-300">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">
                        {transaction.stockSymbol}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                            transaction.type === 'BUY'
                              ? 'bg-green-500/15 text-green-300'
                              : 'bg-red-500/15 text-red-300'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">{transaction.quantity}</td>
                      <td className="px-5 py-4 text-right text-slate-300">
                        {formatCurrency(transaction.pricePerUnit)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-white">
                        {formatCurrency(transaction.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-700/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="px-5 py-10 text-center text-slate-400">
            No transactions yet. Start trading to see your history!
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
