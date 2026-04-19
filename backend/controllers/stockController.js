const Stock = require('../models/Stock');

// Initialize stock data (seed data)
const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150.25 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2800.5 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', currentPrice: 320.75 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3100.0 },
  { symbol: 'META', name: 'Meta Platforms Inc.', currentPrice: 310.45 },
  { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 240.8 },
  { symbol: 'NVIDIA', name: 'NVIDIA Corporation', currentPrice: 875.3 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', currentPrice: 145.6 },
];

// Initialize stocks
exports.initializeStocks = async (req, res) => {
  try {
    const existingStocks = await Stock.countDocuments();
    if (existingStocks > 0) {
      return res.status(200).json({ message: 'Stocks already initialized' });
    }

    const stocks = await Stock.insertMany(sampleStocks);
    res.status(201).json({
      message: 'Stocks initialized successfully',
      stocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().select('-priceHistory');
    res.status(200).json({ stocks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single stock
exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stock price (simulated real-time update)
exports.updateStockPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const stock = await Stock.findByIdAndUpdate(
      id,
      {
        currentPrice: price,
        lastUpdated: new Date(),
        $push: { priceHistory: { price, timestamp: new Date() } },
      },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.status(200).json({ message: 'Stock price updated', stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate price movement (for real-time updates)
exports.simulatePriceFeed = async (req, res) => {
  try {
    const stocks = await Stock.find();

    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        // Random price movement between -5% to +5%
        const percentChange = (Math.random() - 0.5) * 0.1;
        const newPrice = stock.currentPrice * (1 + percentChange);

        return await Stock.findByIdAndUpdate(
          stock._id,
          {
            currentPrice: parseFloat(newPrice.toFixed(2)),
            lastUpdated: new Date(),
            $push: { priceHistory: { price: newPrice, timestamp: new Date() } },
          },
          { new: true }
        );
      })
    );

    // Broadcast updated prices to all connected WebSocket clients
    try {
      const { io } = require('../server');
      io.emit('stock-price-update', updatedStocks);
    } catch (socketError) {
      console.log('WebSocket broadcast note: Could not emit prices');
    }

    res.status(200).json({
      message: 'Stock prices updated',
      stocks: updatedStocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
