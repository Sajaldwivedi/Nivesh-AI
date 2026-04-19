# Finnhub API Integration Guide

This document explains how the Finnhub API has been integrated into the Nivesh AI stock simulator.

## Overview

The integration provides real-time stock market data from Finnhub, replacing simulated data with actual market quotes, candlestick charts, and company profiles.

## Architecture

### Backend Structure

```
backend/
├── services/
│   └── finnhubService.js          # Finnhub API wrapper with caching
├── routes/
│   └── finnhubRoutes.js           # Express routes for Finnhub endpoints
└── server.js                       # Main server with Finnhub routes registered
```

### Frontend Structure

```
frontend/src/
├── services/
│   └── finnhubApi.js              # Axios client for Finnhub endpoints
├── hooks/
│   └── useFinnhubData.js          # Custom React hooks for data fetching
└── components/                     # Components using Finnhub data
```

## Configuration

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install axios
   ```

2. **Environment Variables** (`.env`)
   ```env
   FINNHUB_API_KEY=your_api_key_here
   FINNHUB_BASE_URL=https://finnhub.io/api/v1
   ```

   The API key is already configured in the `.env` file. **Never expose this key in the frontend.**

### Frontend Setup

1. **API Base URL** (Optional)
   
   Create or update `frontend/.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   If not set, defaults to `http://localhost:5000/api`

## API Endpoints

All endpoints are prefixed with `/api/finnhub`

### 1. Get Quote Data
```
GET /api/finnhub/quote/:symbol

Response:
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 150.25,
    "high": 152.10,
    "low": 149.50,
    "open": 150.00,
    "previousClose": 149.75,
    "change": 0.50,
    "changePercent": 0.33,
    "timestamp": "2024-04-19T10:30:00Z"
  },
  "source": "api" | "cache"
}
```

### 2. Get Candlestick Data
```
GET /api/finnhub/candles/:symbol?resolution=5&from=1705660800&to=1705747200

Query Parameters:
- resolution: 1, 5, 15, 30, 60 (minutes), D (day), W (week), M (month)
- from: Unix timestamp (start time)
- to: Unix timestamp (end time)

Response:
{
  "success": true,
  "data": [
    {
      "time": 1705660800,
      "open": 150.00,
      "high": 152.10,
      "low": 149.50,
      "close": 151.25,
      "volume": 50000000
    },
    ...
  ],
  "source": "api" | "cache"
}
```

### 3. Search Symbols
```
GET /api/finnhub/search?q=apple

Query Parameters:
- q: Search query (symbol or company name)

Response:
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "description": "Apple Inc",
      "displaySymbol": "AAPL"
    },
    ...
  ],
  "source": "api" | "cache"
}
```

### 4. Get Company Profile
```
GET /api/finnhub/profile/:symbol

Response:
{
  "success": true,
  "data": {
    "country": "US",
    "currency": "USD",
    "exchange": "NASDAQ",
    "finnhubIndustry": "Technology",
    "ipo": "1980-12-12",
    "logo": "https://...",
    "marketCapitalization": 2800000,
    "name": "Apple Inc",
    "phone": "+1 4089961010",
    "shareOutstanding": 15400,
    "ticker": "AAPL",
    "weburl": "https://www.apple.com/"
  }
}
```

### 5. Cache Statistics (Debug Only)
```
GET /api/finnhub/cache-stats

Response:
{
  "success": true,
  "cacheStats": {
    "quotes": 5,
    "candles": 2,
    "searches": 3
  }
}
```

### 6. Clear Cache (Admin Only)
```
POST /api/finnhub/clear-cache

Response:
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

## Frontend Integration

### Using the `useQuote` Hook

```javascript
import { useQuote } from '../hooks/useFinnhubData';

function StockCard({ symbol }) {
  const { quote, loading, error } = useQuote(symbol, 5000); // Auto-refresh every 5s

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quote) return null;

  return (
    <div>
      <h3>{symbol}</h3>
      <p>Price: ${quote.currentPrice}</p>
      <p>Change: {quote.changePercent}%</p>
      <p>High: ${quote.high}</p>
      <p>Low: ${quote.low}</p>
    </div>
  );
}
```

### Using the `useCandles` Hook

```javascript
import { useCandles } from '../hooks/useFinnhubData';

function Chart({ symbol }) {
  const now = Math.floor(Date.now() / 1000);
  const oneWeekAgo = now - (7 * 24 * 60 * 60);

  const { candles, loading, error } = useCandles(
    symbol,
    'D', // Daily resolution
    oneWeekAgo,
    now
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!candles) return null;

  // Use candles data with TradingView Lightweight Charts
  return <LightweightChart data={candles} />;
}
```

### Using the `useSymbolSearch` Hook

```javascript
import { useSymbolSearch } from '../hooks/useFinnhubData';

function SearchBar() {
  const { query, results, loading, setQuery } = useSymbolSearch(300); // 300ms debounce

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search symbols..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map((result) => (
          <li key={result.symbol}>
            {result.symbol} - {result.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Caching Strategy

The backend implements intelligent in-memory caching with different TTLs:

| Cache Type | TTL | Purpose |
|-----------|-----|---------|
| Quotes | 5 seconds | Real-time price updates |
| Candles | 1 minute | Chart data (less frequent updates) |
| Search | 30 seconds | Symbol search results |

### How Caching Works

1. **On Request**: Service checks cache first
2. **Cache Hit**: Returns cached data if not expired
3. **Cache Miss**: Fetches from Finnhub API and caches result
4. **Expiration**: Automatic cleanup runs every 30 seconds

### Benefits

- ✅ Reduces API calls and rate limiting issues
- ✅ Faster response times for repeated requests
- ✅ Lower bandwidth usage
- ✅ Better user experience

## Rate Limiting

Finnhub API rate limits vary by plan:
- Free Plan: 60 API calls per minute

The caching mechanism helps stay within rate limits by:
1. Caching recent quotes (5-second TTL)
2. Batching requests when possible
3. Debouncing search queries (300ms default)

## Error Handling

All endpoints return errors gracefully:

```javascript
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

Frontend hooks provide `error` state for handling failures:

```javascript
const { quote, error } = useQuote('INVALID_SYMBOL');

if (error) {
  // Show user-friendly error message
  toast.error('Failed to fetch stock data');
}
```

## Security

### ✅ Best Practices Implemented

1. **API Key Protection**
   - Stored only in backend `.env` file
   - Never exposed in frontend
   - Only accessible by backend routes

2. **Input Validation**
   - All endpoints validate input parameters
   - Sanitize query strings
   - Reject invalid symbols

3. **Error Messages**
   - Generic error messages to users
   - Detailed logs only in backend console

4. **CORS Configuration**
   - Frontend origin whitelisted in server

## Performance Optimization

### Caching Example

```
Request 1: GET /quote/AAPL → Fetch from API (source: "api")
Request 2: GET /quote/AAPL (within 5s) → Return cached (source: "cache")
Request 3: GET /quote/AAPL (after 5s) → Fetch from API (source: "api")
```

### Debounced Search Example

```
User types: "a" → Wait (debounce)
User types: "ap" → Wait (debounce)
User types: "app" → 300ms delay, then search API (1 request instead of 3)
```

## Debugging

### Check Cache Status

```bash
# Terminal
curl http://localhost:5000/api/finnhub/cache-stats

# Response
{
  "success": true,
  "cacheStats": {
    "quotes": 2,
    "candles": 1,
    "searches": 0
  }
}
```

### Clear Cache (Development Only)

```bash
curl -X POST http://localhost:5000/api/finnhub/clear-cache
```

### Monitor API Calls

Add logging in browser DevTools:
```javascript
// In finnhubApi.js for debugging
console.log('Finnhub API Call:', symbol, 'Source:', result.source);
```

## Limitations & Notes

1. **Real-Time Updates**: Quotes are updated every 5 seconds (adjustable)
2. **Historical Data**: Candles are cached for 1 minute
3. **Search Results**: Limited to 10 results per search
4. **Symbol Coverage**: Only common stocks (filters out ETFs, indexes)

## Troubleshooting

### Problem: "FINNHUB_API_KEY is not set"
**Solution**: Add `FINNHUB_API_KEY=your_key` to `.env`

### Problem: "Failed to fetch quote"
**Solution**: 
- Check API key is valid
- Verify rate limit not exceeded
- Ensure symbol is valid (e.g., "AAPL" not "Apple")

### Problem: "No candle data available"
**Solution**:
- Verify `from` and `to` timestamps are valid
- Use resolution that market data exists for
- Try a different date range

### Problem: CORS errors in frontend
**Solution**:
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env`
- Clear browser cache

## Next Steps

1. **Integrate into StocksPage**: Replace local socket data with Finnhub quotes
2. **Update Charts**: Use candlestick data from Finnhub API
3. **Add Watchlist**: Let users search and add stocks to watchlist
4. **Portfolio Tracking**: Fetch real prices for portfolio calculations
5. **Historical Analysis**: Store candle data for technical analysis

## Additional Resources

- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [React Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**Last Updated**: April 19, 2024
