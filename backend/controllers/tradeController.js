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
    if (!stockId || !quantity || quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Invalid stock ID or quantity. Quantity must be a positive number.' });
    }

    // Convert quantity to integer and revalidate
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity. Must be a positive whole number.' });
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

    const totalCost = stock.currentPrice * parsedQuantity;

    // Check if user has sufficient balance (with safety check)
    if (!user.balance || user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance. Required: ₹' + totalCost.toFixed(2) });
    }

    // Deduct amount from user balance
    user.balance -= totalCost;

    // Safety check: ensure balance doesn't go negative due to precision issues
    if (user.balance < 0) {
      user.balance += totalCost; // Revert transaction
      return res.status(400).json({ message: 'Transaction failed: Balance would become negative' });
    }
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockId,
      stockSymbol: stock.symbol,
      type: 'BUY',
      quantity: parsedQuantity,
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
      const newQuantity = holding.quantity + parsedQuantity;

      holding.quantity = newQuantity;
      holding.averageBuyPrice = newTotalCost / newQuantity;
      holding.totalInvested = newTotalCost;
      holding.currentValue = newQuantity * stock.currentPrice;
      holding.gainLoss = holding.currentValue - holding.totalInvested;
      // Safe calculation with zero check
      holding.gainLossPercent =
        holding.totalInvested > 0
          ? (holding.gainLoss / holding.totalInvested) * 100
          : 0;
    } else {
      // Add new holding
      portfolio.holdings.push({
        stockId,
        stockSymbol: stock.symbol,
        quantity: parsedQuantity,
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
    // Safe percentage calculation - prevent Infinity or NaN
    if (portfolio.totalInvested > 0) {
      portfolio.totalGainLossPercent = (portfolio.totalGainLoss / portfolio.totalInvested) * 100;
    } else {
      portfolio.totalGainLossPercent = 0;
    }

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
    if (!stockId || !quantity || quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ message: 'Invalid stock ID or quantity. Quantity must be a positive number.' });
    }

    // Convert quantity to integer and revalidate
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity. Must be a positive whole number.' });
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
    if (holding.quantity < parsedQuantity) {
      return res.status(400).json({ message: 'Insufficient stock quantity. You have: ' + holding.quantity });
    }

    // Get stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const totalSaleAmount = stock.currentPrice * parsedQuantity;

    // Update user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.balance += totalSaleAmount;

    // Safety check: ensure balance is positive after credit
    if (user.balance < 0 || !isFinite(user.balance)) {
      user.balance -= totalSaleAmount; // Revert transaction
      return res.status(400).json({ message: 'Transaction failed: Invalid balance state' });
    }
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockId,
      stockSymbol: stock.symbol,
      type: 'SELL',
      quantity: parsedQuantity,
      pricePerUnit: stock.currentPrice,
      totalAmount: totalSaleAmount,
    });
    await transaction.save();

    // Update holding
    if (holding.quantity === parsedQuantity) {
      // Remove holding if selling all stocks
      portfolio.holdings.splice(holdingIndex, 1);
    } else {
      // Update holding
      holding.quantity -= parsedQuantity;
      holding.totalInvested = holding.quantity * holding.averageBuyPrice;
      holding.currentValue = holding.quantity * stock.currentPrice;
      holding.gainLoss = holding.currentValue - holding.totalInvested;
      // Safe calculation with zero check
      holding.gainLossPercent =
        holding.totalInvested > 0 && holding.quantity > 0
          ? (holding.gainLoss / holding.totalInvested) * 100
          : 0;
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
    // Safe percentage calculation - prevent Infinity or NaN
    if (portfolio.totalInvested > 0) {
      portfolio.totalGainLossPercent = (portfolio.totalGainLoss / portfolio.totalInvested) * 100;
    } else {
      portfolio.totalGainLossPercent = 0;
    }

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
