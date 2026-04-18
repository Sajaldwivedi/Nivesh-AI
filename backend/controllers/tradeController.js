const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const User = require('../models/User');

// Buy stock
exports.buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.userId;

    // Validate input
    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID or quantity' });
    }

    // Get stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalCost = stock.currentPrice * quantity;

    // Check if user has sufficient balance
    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct amount from user balance
    user.balance -= totalCost;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockId,
      stockSymbol: stock.symbol,
      type: 'BUY',
      quantity,
      pricePerUnit: stock.currentPrice,
      totalAmount: totalCost,
    });
    await transaction.save();

    // Update portfolio
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = new Portfolio({ userId, holdings: [] });
    }

    // Check if stock already exists in portfolio
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId
    );

    if (holdingIndex > -1) {
      // Update existing holding
      const holding = portfolio.holdings[holdingIndex];
      const previousCost = holding.quantity * holding.averageBuyPrice;
      const newTotalCost = previousCost + totalCost;
      const newQuantity = holding.quantity + quantity;

      holding.quantity = newQuantity;
      holding.averageBuyPrice = newTotalCost / newQuantity;
      holding.totalInvested = newTotalCost;
      holding.currentValue = newQuantity * stock.currentPrice;
      holding.gainLoss = holding.currentValue - holding.totalInvested;
      holding.gainLossPercent =
        (holding.gainLoss / holding.totalInvested) * 100;
    } else {
      // Add new holding
      portfolio.holdings.push({
        stockId,
        stockSymbol: stock.symbol,
        quantity,
        averageBuyPrice: stock.currentPrice,
        totalInvested: totalCost,
        currentValue: totalCost,
        gainLoss: 0,
        gainLossPercent: 0,
      });
    }

    // Recalculate portfolio totals
    portfolio.totalInvested = portfolio.holdings.reduce(
      (sum, h) => sum + h.totalInvested,
      0
    );
    portfolio.totalCurrentValue = portfolio.holdings.reduce(
      (sum, h) => sum + h.currentValue,
      0
    );
    portfolio.totalGainLoss = portfolio.totalCurrentValue - portfolio.totalInvested;
    portfolio.totalGainLossPercent =
      (portfolio.totalGainLoss / portfolio.totalInvested) * 100 || 0;

    await portfolio.save();

    res.status(201).json({
      message: 'Stock purchased successfully',
      transaction,
      portfolio,
      userBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sell stock
exports.sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.userId;

    // Validate input
    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid stock ID or quantity' });
    }

    // Get portfolio
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Find holding
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId
    );
    if (holdingIndex === -1) {
      return res.status(400).json({ message: 'Stock not found in portfolio' });
    }

    const holding = portfolio.holdings[holdingIndex];

    // Check if user has enough stocks
    if (holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock quantity' });
    }

    // Get stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const totalSaleAmount = stock.currentPrice * quantity;

    // Update user balance
    const user = await User.findById(userId);
    user.balance += totalSaleAmount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockId,
      stockSymbol: stock.symbol,
      type: 'SELL',
      quantity,
      pricePerUnit: stock.currentPrice,
      totalAmount: totalSaleAmount,
    });
    await transaction.save();

    // Update holding
    if (holding.quantity === quantity) {
      // Remove holding if selling all stocks
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      // Update holding
      holding.quantity -= quantity;
      holding.totalInvested = holding.quantity * holding.averageBuyPrice;
      holding.currentValue = holding.quantity * stock.currentPrice;
      holding.gainLoss = holding.currentValue - holding.totalInvested;
      holding.gainLossPercent =
        (holding.gainLoss / holding.totalInvested) * 100;
    }

    // Recalculate portfolio totals
    portfolio.totalInvested = portfolio.holdings.reduce(
      (sum, h) => sum + h.totalInvested,
      0
    );
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

    res.status(200).json({
      message: 'Stock sold successfully',
      transaction,
      portfolio,
      userBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction history with pagination
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments({ userId });

    res.status(200).json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
