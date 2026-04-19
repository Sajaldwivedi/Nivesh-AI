const Stock = require('../models/Stock');

// Initialize stock data (seed data)
const sampleStocks = [
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Ltd.', currentPrice: 307.0, openPrice: 307.0 },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', currentPrice: 3018.25, openPrice: 3018.25 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', currentPrice: 4978.4, openPrice: 4978.4 },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', currentPrice: 287.6, openPrice: 287.6 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and SEZ Ltd.', currentPrice: 1386.15, openPrice: 1386.15 },
  { symbol: 'MOTHERSON', name: 'Samvardhana Motherson International Ltd.', currentPrice: 194.35, openPrice: 194.35 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', currentPrice: 162.8, openPrice: 162.8 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.', currentPrice: 1271.9, openPrice: 1271.9 },
  { symbol: 'INFY', name: 'Infosys Ltd.', currentPrice: 1718.2, openPrice: 1718.2 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', currentPrice: 3912.6, openPrice: 3912.6 },
];

const buildSeedStock = (stock) => ({
  ...stock,
  highPrice: stock.highPrice || parseFloat((stock.currentPrice * 1.015).toFixed(2)),
  lowPrice: stock.lowPrice || parseFloat((stock.currentPrice * 0.985).toFixed(2)),
  volume: stock.volume || Math.floor(250000 + Math.random() * 500000),
  marketCap: stock.marketCap || 'N/A',
  priceHistory:
    stock.priceHistory && stock.priceHistory.length > 0
      ? stock.priceHistory
      : [
          {
            price: stock.currentPrice,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
          },
        ],
  lastUpdated: new Date(),
});

const ensureStocksSeeded = async () => {
  const existingStocks = await Stock.countDocuments();
  if (existingStocks > 0) {
    return Stock.find();
  }

  return Stock.insertMany(sampleStocks.map(buildSeedStock));
};

const generateMarketTick = (stock) => {
  const percentChange = (Math.random() - 0.5) * 0.06;
  const nextPrice = Math.max(1, stock.currentPrice * (1 + percentChange));
  const formattedPrice = parseFloat(nextPrice.toFixed(2));
  const nextHigh = Math.max(stock.highPrice || formattedPrice, formattedPrice);
  const nextLow = Math.min(stock.lowPrice || formattedPrice, formattedPrice);
  const nextVolume = (stock.volume || 0) + Math.floor(15000 + Math.random() * 40000);

  return {
    currentPrice: formattedPrice,
    highPrice: parseFloat(nextHigh.toFixed(2)),
    lowPrice: parseFloat(nextLow.toFixed(2)),
    volume: nextVolume,
    lastUpdated: new Date(),
  };
};

const simulateMarketTick = async () => {
  const stocks = await Stock.find();
  if (stocks.length === 0) {
    return [];
  }

  const updatedStocks = await Promise.all(
    stocks.map(async (stock) => {
      const nextState = generateMarketTick(stock);

      return Stock.findByIdAndUpdate(
        stock._id,
        {
          ...nextState,
          $push: {
            priceHistory: {
              price: nextState.currentPrice,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
    })
  );

  return updatedStocks;
};

// Initialize stocks
exports.initializeStocks = async (req, res) => {
  try {
    const stocks = await ensureStocksSeeded();
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
    const stocks = await Stock.find().select('-priceHistory').sort({ symbol: 1 });
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

    const existingStock = await Stock.findById(id);
    if (!existingStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const stock = await Stock.findByIdAndUpdate(
      id,
      {
        currentPrice: price,
        highPrice: Math.max(price, existingStock.highPrice || price),
        lowPrice: Math.min(price, existingStock.lowPrice || price),
        lastUpdated: new Date(),
        $push: { priceHistory: { price, timestamp: new Date() } },
      },
      { new: true }
    );

    res.status(200).json({ message: 'Stock price updated', stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate price movement (for real-time updates)
exports.simulatePriceFeed = async (req, res) => {
  try {
    const updatedStocks = await simulateMarketTick();
    const io = req.app.get('io');

    if (io) {
      io.emit('stock-price-update', updatedStocks);
    }

    res.status(200).json({
      message: 'Stock prices updated',
      stocks: updatedStocks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ensureStocksSeeded = ensureStocksSeeded;
exports.runMarketSimulation = async (io) => {
  const updatedStocks = await simulateMarketTick();

  if (io && updatedStocks.length > 0) {
    io.emit('stock-price-update', updatedStocks);
  }

  return updatedStocks;
};
