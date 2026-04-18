const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    holdings: [
      {
        stockId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stock',
          required: true,
        },
        stockSymbol: String,
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        averageBuyPrice: {
          type: Number,
          required: true,
        },
        totalInvested: {
          type: Number,
          required: true,
        },
        currentValue: {
          type: Number,
          default: 0,
        },
        gainLoss: {
          type: Number,
          default: 0,
        },
        gainLossPercent: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalInvested: {
      type: Number,
      default: 0,
    },
    totalCurrentValue: {
      type: Number,
      default: 0,
    },
    totalGainLoss: {
      type: Number,
      default: 0,
    },
    totalGainLossPercent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
