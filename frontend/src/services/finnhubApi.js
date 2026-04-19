import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const finnhubAPI = axios.create({
  baseURL: `${API_BASE_URL}/finnhub`,
  timeout: 10000,
});

/**
 * Get real-time quote data for a stock symbol
 */
export const getQuote = async (symbol) => {
  try {
    const response = await finnhubAPI.get(`/quote/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get candlestick data for a stock symbol
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @param {string} resolution - Candle resolution ('1', '5', '15', '30', '60', 'D', 'W', 'M')
 * @param {number} from - Unix timestamp for start time
 * @param {number} to - Unix timestamp for end time
 */
export const getCandles = async (symbol, resolution = '5', from, to) => {
  try {
    const response = await finnhubAPI.get(`/candles/${symbol}`, {
      params: { resolution, from, to },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Search for stock symbols
 */
export const searchSymbol = async (query) => {
  try {
    const response = await finnhubAPI.get('/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error);
    throw error;
  }
};

/**
 * Get company profile
 */
export const getCompanyProfile = async (symbol) => {
  try {
    const response = await finnhubAPI.get(`/profile/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get cache statistics (for debugging)
 */
export const getCacheStats = async () => {
  try {
    const response = await finnhubAPI.get('/cache-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    throw error;
  }
};

/**
 * Clear cache (admin only)
 */
export const clearCache = async () => {
  try {
    const response = await finnhubAPI.post('/clear-cache');
    return response.data;
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
};

export default {
  getQuote,
  getCandles,
  searchSymbol,
  getCompanyProfile,
  getCacheStats,
  clearCache,
};
