import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { tradeAPI } from '../services/api';

const BuyStockModal = ({ stock, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalCost = (quantity * stock.currentPrice).toFixed(2);

  const handleBuy = async () => {
    // Validate quantity - ensure it's a valid positive number
    const parsedQty = parseInt(quantity);
    if (!quantity || isNaN(parsedQty) || parsedQty <= 0) {
      toast.error('Please enter a valid quantity (positive whole number)');
      return;
    }

    setLoading(true);
    try {
      await tradeAPI.buyStock({
        stockId: stock._id,
        quantity: parsedQty,
      });
      toast.success(`Bought ${quantity} shares of ${stock.symbol}!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to buy stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Buy {stock.symbol}</h2>

        <div className="mb-4">
          <p className="text-gray-400 text-sm">Current Price</p>
          <p className="text-3xl font-bold text-blue-500">
            ₹{stock.currentPrice.toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-6 bg-gray-800 p-3 rounded">
          <p className="text-gray-400 text-sm">Total Cost</p>
          <p className="text-2xl font-bold text-green-500">₹{totalCost}</p>
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
            onClick={handleBuy}
            className="btn btn-success flex-1"
            disabled={loading}
          >
            {loading ? 'Buying...' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyStockModal;
