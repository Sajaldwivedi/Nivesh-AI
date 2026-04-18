const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// Get user portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.userId;
    let portfolio = await Portfolio.findOne({ userId }).populate(
      'holdings.stockId'
    );

    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        holdings: [],
        totalInvested: 0,
        totalCurrentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
      });
      await portfolio.save();
    }

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update portfolio with current prices
exports.updatePortfolioValues = async (req, res) => {
  try {
    const userId = req.userId;
    const portfolio = await Portfolio.findOne({ userId }).populate(
      'holdings.stockId'
    );

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Update values for each holding
    portfolio.holdings.forEach((holding) => {
      const stock = holding.stockId;
      holding.currentValue = holding.quantity * stock.currentPrice;
      holding.gainLoss = holding.currentValue - holding.totalInvested;
      holding.gainLossPercent =
        holding.totalInvested > 0
          ? (holding.gainLoss / holding.totalInvested) * 100
          : 0;
    });

    // Recalculate portfolio totals
    portfolio.totalCurrentValue = portfolio.holdings.reduce(
      (sum, h) => sum + h.currentValue,
      0
    );
    portfolio.totalGainLoss = portfolio.totalCurrentValue - portfolio.totalInvested;
    portfolio.totalGainLossPercent =
      portfolio.totalInvested > 0
        ? (portfolio.totalGainLoss / portfolio.totalInvested) * 100
        : 0;

    await portfolio.save();

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get portfolio summary
exports.getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const portfolio = await Portfolio.findOne({ userId }).populate(
      'holdings.stockId'
    );

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const summary = {
      totalInvested: portfolio.totalInvested,
      totalCurrentValue: portfolio.totalCurrentValue,
      totalGainLoss: portfolio.totalGainLoss,
      totalGainLossPercent: portfolio.totalGainLossPercent,
      holdingsCount: portfolio.holdings.length,
      topHolding:
        portfolio.holdings.length > 0
          ? portfolio.holdings.reduce((max, h) =>
              h.currentValue > max.currentValue ? h : max
            )
          : null,
    };

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
