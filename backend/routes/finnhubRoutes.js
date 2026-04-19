const express = require('express');
const finnhubService = require('../services/finnhubService');
const router = express.Router();

/**
 * GET /api/finnhub/quote/:symbol
 * Get real-time quote data for a stock symbol
 */
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.trim().length === 0) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const result = await finnhubService.getQuote(symbol);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        message: 'Failed to fetch quote data',
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      source: result.source,
    });
  } catch (error) {
    console.error('Quote route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * GET /api/finnhub/candles/:symbol
 * Query params: resolution, from, to
 * Get candlestick data for a stock symbol
 */
router.get('/candles/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { resolution = '5', from, to } = req.query;

    if (!symbol || symbol.trim().length === 0) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to timestamps are required' });
    }

    const result = await finnhubService.getCandles(symbol, resolution, from, to);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        message: 'Failed to fetch candle data',
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      source: result.source,
      symbol: symbol.toUpperCase(),
      resolution,
    });
  } catch (error) {
    console.error('Candles route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * GET /api/finnhub/search
 * Query params: q
 * Search for stock symbols
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await finnhubService.searchSymbol(q);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        message: 'Failed to search symbols',
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      source: result.source,
      query: q,
    });
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * GET /api/finnhub/profile/:symbol
 * Get company profile information
 */
router.get('/profile/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.trim().length === 0) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const result = await finnhubService.getCompanyProfile(symbol);

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
        message: 'Failed to fetch company profile',
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * GET /api/finnhub/cache-stats
 * Get cache statistics (for debugging)
 */
router.get('/cache-stats', (req, res) => {
  const stats = finnhubService.getCacheStats();
  res.status(200).json({
    success: true,
    cacheStats: stats,
  });
});

/**
 * POST /api/finnhub/clear-cache
 * Clear all caches (admin only in production)
 */
router.post('/clear-cache', (req, res) => {
  finnhubService.clearCache();
  res.status(200).json({
    success: true,
    message: 'Cache cleared successfully',
  });
});

module.exports = router;
