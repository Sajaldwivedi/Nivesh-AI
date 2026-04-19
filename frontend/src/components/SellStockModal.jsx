import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { tradeAPI } from '../services/api';

const SellStockModal = ({ holding, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalValue = (quantity * holding.stockId.currentPrice).toFixed(2);

  const handleSell = async () => {
    // Validate quantity - ensure it's a valid positive number not exceeding holdings
    const parsedQty = parseInt(quantity);
    if (!quantity || isNaN(parsedQty) || parsedQty <= 0) {
      toast.error('Please enter a valid quantity (positive whole number)');
      return;
    }
    if (parsedQty > holding.quantity) {
      toast.error(`Cannot sell more than ${holding.quantity} shares`);
      return;
    }

    setLoading(true);
    try {
      await tradeAPI.sellStock({
        stockId: holding.stockId._id,
        quantity: parsedQty,
      });
      toast.success(`Sold ${quantity} shares of ${holding.stockSymbol}!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sell stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sell {holding.stockSymbol}</h2>

        <div className="mb-4">
          <p className="text-gray-400 text-sm">Current Price</p>
          <p className="text-3xl font-bold text-blue-500">
            ₹{holding.stockId.currentPrice.toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-sm">Available Quantity</p>
          <p className="text-xl font-bold">{holding.quantity}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quantity to Sell</label>
          <input
            type="number"
            min="1"
            max={holding.quantity}
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-6 bg-gray-800 p-3 rounded">
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-green-500">₹{totalValue}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSell}
            className="btn btn-success flex-1"
            disabled={loading}
          >
            {loading ? 'Selling...' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellStockModal;
