const axios = require('axios');

const FINNHUB_BASE_URL = process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const hasApiKey = () => typeof FINNHUB_API_KEY === 'string' && FINNHUB_API_KEY.trim().length > 0;

if (!FINNHUB_API_KEY) {
  console.warn('⚠️ FINNHUB_API_KEY is not set in .env file');
}

// In-memory cache for quotes (5-second TTL)
const quoteCache = new Map();
const QUOTE_CACHE_TTL = 5000; // 5 seconds

// In-memory cache for candles (1-minute TTL)
const candleCache = new Map();
const CANDLE_CACHE_TTL = 60000; // 1 minute

// In-memory cache for search (30-second TTL)
const searchCache = new Map();
const SEARCH_CACHE_TTL = 30000; // 30 seconds

// Keep resolved Finnhub symbol per local symbol to avoid repeated fallback probing
const resolvedSymbolCache = new Map();
const RESOLVED_SYMBOL_TTL = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Get cached data or return null if expired
 */
const getFromCache = (cache, key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

/**
 * Set data in cache with TTL
 */
const setInCache = (cache, key, data, ttl) => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
};

const buildCandidateSymbols = (symbol) => {
  const base = String(symbol || '').trim().toUpperCase();
  if (!base) {
    return [];
  }

  const candidates = [base];
  if (!base.includes('.')) {
    candidates.push(`${base}.NS`);
    candidates.push(`${base}.BO`);
  }
  return candidates;
};

const isValidQuotePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  const c = Number(payload.c || 0);
  const pc = Number(payload.pc || 0);
  return c > 0 || pc > 0;
};

const fetchRawQuote = async (symbol) => {
  const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
    params: {
      symbol,
      token: FINNHUB_API_KEY,
    },
  });
  return response.data;
};

const resolveFinnhubSymbol = async (inputSymbol) => {
  const cacheKey = `resolved_${String(inputSymbol || '').toUpperCase()}`;
  const cached = getFromCache(resolvedSymbolCache, cacheKey);
  if (cached) {
    return cached;
  }

  const candidates = buildCandidateSymbols(inputSymbol);
  for (const candidate of candidates) {
    try {
      const payload = await fetchRawQuote(candidate);
      if (isValidQuotePayload(payload)) {
        setInCache(resolvedSymbolCache, cacheKey, candidate, RESOLVED_SYMBOL_TTL);
        return candidate;
      }
    } catch (error) {
      // Try next candidate
    }
  }

  return null;
};

/**
 * Fetch real-time quote data for a stock symbol
 * Returns: current price (c), high (h), low (l), open (o), previous close (pc)
 */
exports.getQuote = async (symbol) => {
  try {
    if (!hasApiKey()) {
      return {
        success: false,
        error: 'Finnhub API key is not configured',
        data: null,
      };
    }

    // Check cache first
    const cacheKey = `quote_${symbol.toUpperCase()}`;
    const cachedData = getFromCache(quoteCache, cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
        source: 'cache',
      };
    }

    const resolvedSymbol = await resolveFinnhubSymbol(symbol);
    if (!resolvedSymbol) {
      return {
        success: false,
        error: `No supported Finnhub symbol found for ${symbol.toUpperCase()}`,
        data: null,
      };
    }

    // Fetch from Finnhub API
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: resolvedSymbol,
        token: FINNHUB_API_KEY,
      },
    });

    if (!isValidQuotePayload(response.data)) {
      return {
        success: false,
        error: `No quote data available for ${symbol.toUpperCase()}`,
        data: null,
      };
    }

    const { c: currentPrice, h: high, l: low, o: open, pc: previousClose } = response.data;

    const quote = {
      symbol: symbol.toUpperCase(),
      currentPrice: currentPrice || 0,
      high: high || currentPrice || 0,
      low: low || currentPrice || 0,
      open: open || currentPrice || 0,
      previousClose: previousClose || currentPrice || 0,
      change: currentPrice - (previousClose || currentPrice || 0),
      changePercent:
        previousClose && previousClose > 0
          ? ((currentPrice - previousClose) / previousClose) * 100
          : 0,
      finnhubSymbol: resolvedSymbol,
      timestamp: new Date(),
    };

    // Cache the result
    setInCache(quoteCache, cacheKey, quote, QUOTE_CACHE_TTL);

    return {
      success: true,
      data: quote,
      source: 'api',
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch quote',
      data: null,
    };
  }
};

/**
 * Fetch candlestick data for a stock symbol
 * Resolution: 1, 5, 15, 30, 60 (minutes), D (day), W (week), M (month)
 */
exports.getCandles = async (symbol, resolution = '5', from, to) => {
  try {
    if (!hasApiKey()) {
      return {
        success: false,
        error: 'Finnhub API key is not configured',
        data: null,
      };
    }

    // Validate inputs
    if (!symbol || !from || !to) {
      return {
        success: false,
        error: 'Missing required parameters: symbol, from, to',
        data: null,
      };
    }

    // Check cache first
    const cacheKey = `candles_${symbol.toUpperCase()}_${resolution}_${from}_${to}`;
    const cachedData = getFromCache(candleCache, cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
        source: 'cache',
      };
    }

    const resolvedSymbol = await resolveFinnhubSymbol(symbol);
    if (!resolvedSymbol) {
      return {
        success: false,
        error: `No supported Finnhub symbol found for ${symbol.toUpperCase()}`,
        data: null,
      };
    }

    // Fetch from Finnhub API
    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
      params: {
        symbol: resolvedSymbol,
        resolution,
        from,
        to,
        token: FINNHUB_API_KEY,
      },
    });

    if (!response.data.o || response.data.o.length === 0) {
      return {
        success: false,
        error: 'No candle data available',
        data: null,
      };
    }

    // Format candle data
    const candles = response.data.o.map((_, index) => ({
      time: response.data.t[index],
      open: response.data.o[index],
      high: response.data.h[index],
      low: response.data.l[index],
      close: response.data.c[index],
      volume: response.data.v[index] || 0,
    }));

    // Cache the result
    setInCache(candleCache, cacheKey, candles, CANDLE_CACHE_TTL);

    return {
      success: true,
      data: candles,
      source: 'api',
    };
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch candles',
      data: null,
    };
  }
};

/**
 * Search for stock symbols
 */
exports.searchSymbol = async (query) => {
  try {
    if (!hasApiKey()) {
      return {
        success: false,
        error: 'Finnhub API key is not configured',
        data: [],
      };
    }

    // Validate input
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: 'Query is required',
        data: [],
      };
    }

    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedData = getFromCache(searchCache, cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
        source: 'cache',
      };
    }

    // Fetch from Finnhub API
    const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
      params: {
        q: query,
        token: FINNHUB_API_KEY,
      },
    });

    // Format and filter results
    const results = (response.data.result || [])
      .filter((item) => item.type === 'Common Stock') // Only common stocks
      .slice(0, 10) // Limit to 10 results
      .map((item) => ({
        symbol: item.symbol,
        description: item.description,
        displaySymbol: item.displaySymbol,
      }));

    // Cache the result
    setInCache(searchCache, cacheKey, results, SEARCH_CACHE_TTL);

    return {
      success: true,
      data: results,
      source: 'api',
    };
  } catch (error) {
    console.error(`Error searching symbols:`, error.message);
    return {
      success: false,
      error: error.message || 'Failed to search symbols',
      data: [],
    };
  }
};

/**
 * Get company profile information
 */
exports.getCompanyProfile = async (symbol) => {
  try {
    if (!hasApiKey()) {
      return {
        success: false,
        error: 'Finnhub API key is not configured',
        data: null,
      };
    }

    const resolvedSymbol = await resolveFinnhubSymbol(symbol);
    if (!resolvedSymbol) {
      return {
        success: false,
        error: `No supported Finnhub symbol found for ${symbol.toUpperCase()}`,
        data: null,
      };
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/profile2`, {
      params: {
        symbol: resolvedSymbol,
        token: FINNHUB_API_KEY,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error.message);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * Clear expired cache entries periodically
 */
const cleanupCache = () => {
  const now = Date.now();

  // Clean quote cache
  for (const [key, entry] of quoteCache.entries()) {
    if (now > entry.expiresAt) {
      quoteCache.delete(key);
    }
  }

  // Clean candle cache
  for (const [key, entry] of candleCache.entries()) {
    if (now > entry.expiresAt) {
      candleCache.delete(key);
    }
  }

  // Clean search cache
  for (const [key, entry] of searchCache.entries()) {
    if (now > entry.expiresAt) {
      searchCache.delete(key);
    }
  }
};

// Run cleanup every 30 seconds
setInterval(cleanupCache, 30000);

module.exports.clearCache = () => {
  quoteCache.clear();
  candleCache.clear();
  searchCache.clear();
  resolvedSymbolCache.clear();
};

module.exports.getCacheStats = () => {
  return {
    quotes: quoteCache.size,
    candles: candleCache.size,
    searches: searchCache.size,
    resolvedSymbols: resolvedSymbolCache.size,
  };
};
