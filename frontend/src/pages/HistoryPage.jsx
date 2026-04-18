import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { tradeAPI } from '../services/api';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading transaction history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Header
        title="Transaction History"
        subtitle="View all your stock trades"
      />

      {/* Transactions Table */}
      <div className="card">
        {transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Date & Time</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Price/Unit</th>
                    <th className="text-right py-3 px-4">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-gray-800 hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 text-sm">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {transaction.stockSymbol}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            transaction.type === 'BUY'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        {transaction.quantity}
                      </td>
                      <td className="text-right py-3 px-4">
                        ₹{transaction.pricePerUnit.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        ₹{transaction.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No transactions yet. Start trading to see your history!
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
