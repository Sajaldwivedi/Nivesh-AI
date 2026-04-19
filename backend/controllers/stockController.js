const Stock = require('../models/Stock');
const finnhubService = require('../services/finnhubService');

const FINNHUB_BATCH_SIZE = Number(process.env.FINNHUB_BATCH_SIZE || 3);
let finnhubBatchCursor = 0;

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
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', currentPrice: 1694.5, openPrice: 1694.5 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', currentPrice: 1183.8, openPrice: 1183.8 },
  { symbol: 'SBIN', name: 'State Bank of India', currentPrice: 842.2, openPrice: 842.2 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', currentPrice: 1779.9, openPrice: 1779.9 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', currentPrice: 1162.4, openPrice: 1162.4 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', currentPrice: 3762.1, openPrice: 3762.1 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', currentPrice: 2534.7, openPrice: 2534.7 },
  { symbol: 'ITC', name: 'ITC Ltd.', currentPrice: 426.8, openPrice: 426.8 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', currentPrice: 12621.4, openPrice: 12621.4 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', currentPrice: 1569.3, openPrice: 1569.3 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', currentPrice: 2868.6, openPrice: 2868.6 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', currentPrice: 7082.5, openPrice: 7082.5 },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', currentPrice: 2517.2, openPrice: 2517.2 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', currentPrice: 10444.3, openPrice: 10444.3 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', currentPrice: 1335.6, openPrice: 1335.6 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', currentPrice: 1576.4, openPrice: 1576.4 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', currentPrice: 486.2, openPrice: 486.2 },
  { symbol: 'NTPC', name: 'NTPC Ltd.', currentPrice: 362.7, openPrice: 362.7 },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd.', currentPrice: 281.9, openPrice: 281.9 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', currentPrice: 474.3, openPrice: 474.3 },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', currentPrice: 1273.5, openPrice: 1273.5 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', currentPrice: 3441.8, openPrice: 3441.8 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', currentPrice: 4668.9, openPrice: 4668.9 },
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
  const existingStocks = await Stock.find().select('symbol');
  const existingSymbols = new Set(existingStocks.map((stock) => stock.symbol));

  const missingStocks = sampleStocks.filter((stock) => !existingSymbols.has(stock.symbol));

  if (missingStocks.length > 0) {
    await Stock.insertMany(missingStocks.map(buildSeedStock));
  }

  return Stock.find();
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

const syncStocksFromFinnhubBatch = async () => {
  const stocks = await Stock.find().sort({ symbol: 1 });
  if (stocks.length === 0) {
    return [];
  }

  const batchSize = Math.max(1, Math.min(FINNHUB_BATCH_SIZE, stocks.length));
  const batch = [];

  for (let index = 0; index < batchSize; index += 1) {
    const cursor = (finnhubBatchCursor + index) % stocks.length;
    batch.push(stocks[cursor]);
  }
  finnhubBatchCursor = (finnhubBatchCursor + batchSize) % stocks.length;

  await Promise.all(
    batch.map(async (stock) => {
      const quoteResult = await finnhubService.getQuote(stock.symbol);
      if (!quoteResult.success || !quoteResult.data) {
        return;
      }

      const quote = quoteResult.data;
      const resolvedCurrent = Number(quote.currentPrice || 0);
      const resolvedOpen = Number(quote.open || resolvedCurrent || stock.openPrice || 0);
      const resolvedHigh = Number(quote.high || resolvedCurrent || stock.highPrice || 0);
      const resolvedLow = Number(quote.low || resolvedCurrent || stock.lowPrice || 0);

      if (resolvedCurrent <= 0) {
        return;
      }

      await Stock.findByIdAndUpdate(stock._id, {
        currentPrice: resolvedCurrent,
        openPrice: resolvedOpen,
        highPrice: resolvedHigh,
        lowPrice: resolvedLow,
        lastUpdated: new Date(),
        $push: {
          priceHistory: {
            price: resolvedCurrent,
            timestamp: new Date(),
          },
        },
      });
    })
  );

  return Stock.find().sort({ symbol: 1 });
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

exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol || symbol.trim().length === 0) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    const result = await finnhubService.getQuote(symbol);
    if (!result.success) {
      return res.status(400).json({
        message: result.error || 'Failed to fetch quote',
      });
    }

    return res.status(200).json({
      quote: result.data,
      source: result.source,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCandles = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { resolution = '5', from, to } = req.query;

    if (!symbol || symbol.trim().length === 0) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    if (!from || !to) {
      return res.status(400).json({ message: 'from and to timestamps are required' });
    }

    const result = await finnhubService.getCandles(symbol, resolution, from, to);
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to fetch candles' });
    }

    return res.status(200).json({
      candles: result.data,
      source: result.source,
      symbol: symbol.toUpperCase(),
      resolution,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchSymbols = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const result = await finnhubService.searchSymbol(q);
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to search symbols' });
    }

    return res.status(200).json({
      results: result.data,
      source: result.source,
      query: q,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    const useFinnhub = Boolean(process.env.FINNHUB_API_KEY);
    const updatedStocks = useFinnhub ? await syncStocksFromFinnhubBatch() : await simulateMarketTick();
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
  const useFinnhub = Boolean(process.env.FINNHUB_API_KEY);
  let updatedStocks = [];

  if (useFinnhub) {
    try {
      updatedStocks = await syncStocksFromFinnhubBatch();
    } catch (error) {
      console.error('Finnhub sync failed, falling back to simulator:', error.message);
      updatedStocks = await simulateMarketTick();
    }
  } else {
    updatedStocks = await simulateMarketTick();
  }

  if (io && updatedStocks.length > 0) {
    io.emit('stock-price-update', updatedStocks);
  }

  return updatedStocks;
};
