# Quick Start Guide - Finnhub Integration

## ⚡ Start in 3 Steps

### 1️⃣ Start Backend
```bash
cd backend
npm run dev
```
✅ Server runs on `http://localhost:5000`

### 2️⃣ Start Frontend
```bash
cd frontend
npm run dev
```
✅ App runs on `http://localhost:5173`

### 3️⃣ Test API
```bash
curl http://localhost:5000/api/finnhub/quote/AAPL
```
✅ You should get real stock data!

---

## 🎯 Quick Examples

### Get Real Stock Quote
```javascript
import { useQuote } from '../hooks/useFinnhubData';

function MyComponent() {
  const { quote } = useQuote('AAPL');
  return <p>Apple Price: ${quote?.currentPrice}</p>;
}
```

### Search Stocks
```javascript
import { useSymbolSearch } from '../hooks/useFinnhubData';

function SearchStocks() {
  const { query, results, setQuery } = useSymbolSearch();
  
  return (
    <>
      <input onChange={(e) => setQuery(e.target.value)} />
      {results.map(r => <div key={r.symbol}>{r.symbol}</div>)}
    </>
  );
}
```

### Show Chart Data
```javascript
import { useCandles } from '../hooks/useFinnhubData';

function MyChart({ symbol }) {
  const now = Math.floor(Date.now() / 1000);
  const week = now - (7 * 24 * 60 * 60);
  
  const { candles } = useCandles(symbol, 'D', week, now);
  // Use candles with TradingView Lightweight Charts
}
```

---

## 🔧 Available Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/finnhub/quote/:symbol` | Real-time price |
| `GET /api/finnhub/candles/:symbol` | Chart data |
| `GET /api/finnhub/search?q=...` | Search stocks |
| `GET /api/finnhub/profile/:symbol` | Company info |

---

## 💡 Key Features

✅ **Real Data** - Live stock prices from Finnhub  
✅ **Smart Cache** - 5s quotes, 1m candles, 30s search  
✅ **Auto-Refresh** - Quotes update every 5 seconds  
✅ **Debounced Search** - 300ms delay to reduce API calls  
✅ **Secure** - API key only in backend  
✅ **Error Handling** - Graceful failures with toast messages  

---

## ❌ Common Issues

### "Failed to fetch quote"
→ Check if backend is running (`npm run dev` in backend folder)

### "CORS error"
→ Backend running on :5000 and frontend on :5173? Both needed.

### "API Rate Limit Exceeded"
→ Cache is working! Wait a few minutes or restart server.

---

## 📖 Full Docs

See `FINNHUB_INTEGRATION.md` for complete documentation.

---

**That's it! You're ready to use real stock data in your app.** 🚀
