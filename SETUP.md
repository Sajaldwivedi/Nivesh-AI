# SETUP GUIDE - Nivesh AI Stock Market Simulator

## System Requirements

- Node.js v14+ (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/try/download/community)
- npm or yarn package manager
- Windows, macOS, or Linux

## Step-by-Step Setup

### Step 1: Start MongoDB

**Windows:**
```bash
mongod
```
MongoDB will start on `mongodb://localhost:27017`

**macOS/Linux:**
```bash
mongod
```

Or if installed via Homebrew:
```bash
brew services start mongodb-community
```

### Step 2: Backend Setup

1. Open terminal/PowerShell and navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env` file is already configured. You can update it if needed:
   ```
   MONGODB_URI=mongodb://localhost:27017/stock-simulator
   JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   MongoDB Connected: localhost
   Server is running on port 5000
   ```

   **Backend is now running at: http://localhost:5000**

### Step 3: Frontend Setup (New Terminal/Window)

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v... ready in XXX ms
   Local: http://localhost:5173/
   ```

   **Frontend is now running at: http://localhost:5173**

### Step 4: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You should see the Nivesh AI home page

## First Time Usage

### Register a New Account

1. Click "Register" button
2. Enter:
   - Full Name: e.g., "John Doe"
   - Email: e.g., "john@example.com"
   - Password: e.g., "password123" (minimum 6 characters)
   - Confirm Password: Match the password
3. Click "Register"
4. You'll be automatically logged in and redirected to Dashboard

### Starting the Simulator

1. **Dashboard**: View your portfolio overview
   - Starting balance: ₹100,000
   - Charts showing performance
   - Holdings summary

2. **Stocks**: Browse available stocks
   - AAPL, GOOGL, MSFT, AMZN, META, TSLA, NVIDIA, JPM
   - Real-time prices (update every 10 seconds)
   - Search stocks by symbol or name
   - Click "Buy Stock" to purchase

3. **Portfolio**: Manage your holdings
   - View all owned stocks
   - See gain/loss in real-time
   - Calculate ROI percentage
   - Sell stocks using "Sell" button

4. **History**: View all transactions
   - Complete trade history
   - Pagination for easy browsing
   - Type, quantity, and price information

## Key Features to Test

### Buy Stocks
1. Go to Stocks page
2. Click "Buy Stock" on any stock card
3. Enter quantity
4. Click "Buy"
5. Check Dashboard for updated balance and holdings

### Sell Stocks
1. Go to Portfolio page
2. Click "Sell Stock" on any holding
3. Enter quantity (max: your owned quantity)
4. Click "Sell"
5. Balance increases

### Monitor Performance
1. Dashboard shows real-time gains/losses
2. Charts update with portfolio distribution
3. Percentages calculated from average buy price

### View History
1. Go to History page
2. View all past transactions
3. Navigate using pagination (15 per page)

## Development

### Backend API Endpoints

**Authentication:**
```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login user
GET /api/auth/me              - Get current user (protected)
POST /api/auth/logout         - Logout (protected)
```

**Stocks:**
```
GET /api/stocks               - Get all stocks
GET /api/stocks/init          - Initialize stocks
POST /api/stocks/price-feed   - Update stock prices
```

**Trading:**
```
POST /api/trades/buy          - Buy stock (protected)
POST /api/trades/sell         - Sell stock (protected)
GET /api/trades/transactions  - Get transactions (protected)
GET /api/trades/history       - Get history with pagination (protected)
```

**Portfolio:**
```
GET /api/portfolio            - Get portfolio (protected)
GET /api/portfolio/summary    - Get summary (protected)
POST /api/portfolio/update-values - Update values (protected)
```

### Test with cURL (Optional)

Register user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
**Error**: "Error connecting to MongoDB"
**Solution**:
- Ensure MongoDB is running
- Windows: Run `mongod` in PowerShell
- macOS: Run `brew services start mongodb-community` or `mongod`
- Check MongoDB is on `mongodb://localhost:27017`

### Port Already in Use
**Error**: "Server is already running on port 5000"
**Solution**:
- Kill the process on port 5000
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- macOS/Linux: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env` file

### Frontend Can't Connect to Backend
**Error**: Network error when trying to buy/sell
**Solution**:
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend `.env` matches `http://localhost:5173`
- Check if ports are correctly configured

### CORS Error
**Error**: "No 'Access-Control-Allow-Origin' header"
**Solution**:
- Backend CORS is configured
- Ensure frontend accesses from `http://localhost:5173`
- Check `.env` FRONTEND_URL value

### Node Modules Issues
**Error**: Module not found
**Solution**:
```bash
# Clean install
rm -rf node_modules
npm install
```

## Production Deployment

### Before Deploying

1. **Environment Variables (.env)**:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret-key>
   MONGODB_URI=<production-mongodb-uri>
   FRONTEND_URL=<your-frontend-domain>
   ```

2. **Frontend Build**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Backend**: Deploy to services like:
   - Heroku
   - AWS
   - DigitalOcean
   - Render
   - Fly.io

4. **Database**: Use MongoDB Atlas for cloud MongoDB

5. **Frontend**: Deploy built `dist` folder to:
   - Vercel
   - Netlify
   - AWS CloudFront
   - GitHub Pages

## File Structure Verification

After setup, verify these key directories exist:

```
backend/
├── config/db.js
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
└── package.json

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   └── App.jsx
├── package.json
├── vite.config.js
└── index.html
```

## Need Help?

1. Check README.md files in backend/ and frontend/ folders
2. Review error messages in terminal/browser console
3. Ensure all dependencies are installed correctly
4. Verify MongoDB is running and accessible
5. Check ports 5000 and 5173 are not blocked

## Success Indicators

✅ Backend running: "Server is running on port 5000"
✅ Frontend running: "VITE ... ready in XXX ms"
✅ MongoDB connected: "MongoDB Connected: localhost"
✅ Can register and login successfully
✅ Can view stocks and buy/sell
✅ Dashboard shows updated balances
✅ Notifications appear when trading

## Next Steps

After successful setup:
1. Explore all features thoroughly
2. Test buy/sell transactions
3. Check portfolio performance tracking
4. Review transaction history
5. Customize styling in `frontend/tailwind.config.js`
6. Add more stocks in `backend/controllers/stockController.js`
7. Implement real leaderboard functionality
8. Add more trading features as needed

## Enjoy Trading! 📈

You now have a fully functional stock market simulator. Start trading and have fun!
