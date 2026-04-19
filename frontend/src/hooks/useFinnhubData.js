import { useState, useEffect, useCallback, useRef } from 'react';
import * as finnhubApi from '../services/finnhubApi';

/**
 * Custom hook for fetching and caching Finnhub quote data with auto-refresh
 * @param {string} symbol - Stock symbol
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 5000ms)
 */
export const useQuote = (symbol, refreshInterval = 5000) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) {
      setQuote(null);
      return;
    }

    try {
      setLoading(true);
      const result = await finnhubApi.getQuote(symbol);
      if (result.success) {
        setQuote(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch quote');
        setQuote(null);
      }
    } catch (err) {
      setError(err.message || 'Error fetching quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    // Fetch immediately
    fetchQuote();

    // Set up auto-refresh interval
    intervalRef.current = setInterval(fetchQuote, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, refreshInterval, fetchQuote]);

  return { quote, loading, error, refetch: fetchQuote };
};

/**
 * Custom hook for fetching candlestick data
 * @param {string} symbol - Stock symbol
 * @param {string} resolution - Candle resolution
 * @param {number} from - Start timestamp
 * @param {number} to - End timestamp
 */
export const useCandles = (symbol, resolution = '5', from, to) => {
  const [candles, setCandles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandles = useCallback(async () => {
    if (!symbol || !from || !to) {
      setCandles(null);
      return;
    }

    try {
      setLoading(true);
      const result = await finnhubApi.getCandles(symbol, resolution, from, to);
      if (result.success) {
        setCandles(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch candles');
        setCandles(null);
      }
    } catch (err) {
      setError(err.message || 'Error fetching candles');
      setCandles(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, resolution, from, to]);

  useEffect(() => {
    fetchCandles();
  }, [symbol, resolution, from, to, fetchCandles]);

  return { candles, loading, error, refetch: fetchCandles };
};

/**
 * Custom hook for searching stock symbols with debouncing
 * @param {number} debounceDelay - Debounce delay in milliseconds (default: 300ms)
 */
export const useSymbolSearch = (debounceDelay = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const result = await finnhubApi.searchSymbol(searchQuery);
      if (result.success) {
        setResults(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      setError(err.message || 'Error searching symbols');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, debounceDelay);
  }, [debounceDelay, performSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return { query, results, loading, error, setQuery: handleQueryChange };
};

/**
 * Custom hook for fetching company profile
 * @param {string} symbol - Stock symbol
 */
export const useCompanyProfile = (symbol) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!symbol) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      const result = await finnhubApi.getCompanyProfile(symbol);
      if (result.success) {
        setProfile(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch profile');
        setProfile(null);
      }
    } catch (err) {
      setError(err.message || 'Error fetching profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchProfile();
  }, [symbol, fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

export default {
  useQuote,
  useCandles,
  useSymbolSearch,
  useCompanyProfile,
};
