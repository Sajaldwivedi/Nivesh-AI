const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    openPrice: {
      type: Number,
      default: 0,
    },
    highPrice: {
      type: Number,
      default: 0,
    },
    lowPrice: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: String,
      default: 'N/A',
    },
    priceHistory: [
      {
        price: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
