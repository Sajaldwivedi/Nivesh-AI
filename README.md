# Nivesh AI - Stock Market Simulator

A full-stack MERN application for a real-time stock market simulator with trading capabilities.

## Project Structure

```
Nivesh AI/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── stockController.js # Stock data management
│   │   ├── tradeController.js # Trading logic
│   │   └── portfolioController.js # Portfolio management
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── validationMiddleware.js # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Stock.js           # Stock schema
│   │   ├── Portfolio.js       # Portfolio schema
│   │   └── Transaction.js     # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── stockRoutes.js     # Stock endpoints
│   │   ├── tradeRoutes.js     # Trade endpoints
│   │   └── portfolioRoutes.js # Portfolio endpoints
│   ├── server.js              # Express server setup
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── StockCard.jsx  # Stock card component
│   │   │   ├── PortfolioCard.jsx # Portfolio card
│   │   │   ├── BuyStockModal.jsx # Buy modal
│   │   │   ├── SellStockModal.jsx # Sell modal
│   │   │   ├── Charts.jsx     # Chart components
│   │   │   └── Header.jsx     # Page header
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx # Auth state management
│   │   │   └── PortfolioContext.jsx # Portfolio state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Landing page
│   │   │   ├── RegisterPage.jsx # User registration
│   │   │   ├── LoginPage.jsx  # User login
│   │   │   ├── DashboardPage.jsx # Dashboard
│   │   │   ├── StocksPage.jsx # Stock browsing
│   │   │   ├── PortfolioPage.jsx # Portfolio view
│   │   │   └── HistoryPage.jsx # Transaction history
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Protected route wrapper
│   │   ├── services/
│   │   │   └── api.js         # API calls
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── README.md
│   └── .gitignore
│
└── README.md (this file)
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or provide MongoDB URI)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/stock-simulator
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
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
   Application will be available at `http://localhost:5173`

## Features Implemented

### Authentication ✅
- User registration with validation
- Login with JWT token
- Password hashing with bcrypt
- Protected routes
- Token storage in localStorage

### Stock Market ✅
- Browse 8+ real stocks (AAPL, GOOGL, MSFT, AMZN, META, TSLA, NVIDIA, JPM)
- Real-time price updates (simulated every 10 seconds)
- Stock search functionality
- Detailed stock information cards

### Trading System ✅
- Buy stocks with validation
- Sell owned stocks
- Virtual balance management (₹100,000 starting)
- Price-based transaction calculations

### Portfolio Management ✅
- View all holdings
- Calculate gain/loss in real-time
- Track average buy price and quantity
- Portfolio value updates
- Holdings distribution

### Dashboard ✅
- Account balance display
- Investment summary
- Portfolio performance metrics
- Charts for visualization
- Holdings table with real-time data

### Transaction History ✅
- Complete trade history
- Pagination support
- Buy/sell indicators
- Date and time tracking
- Price information per transaction

### UI/UX ✅
- Dark theme with Tailwind CSS
- Responsive design
- Real-time notifications with Toastify
- Interactive charts with Recharts
- Modal dialogs for trading
- Loading states

## API Endpoints Summary

**Authentication**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `POST /api/auth/logout` (protected)

**Stocks**
- `GET /api/stocks`
- `GET /api/stocks/init`
- `POST /api/stocks/price-feed`

**Trading**
- `POST /api/trades/buy` (protected)
- `POST /api/trades/sell` (protected)
- `GET /api/trades/transactions` (protected)
- `GET /api/trades/history` (protected)

**Portfolio**
- `GET /api/portfolio` (protected)
- `GET /api/portfolio/summary` (protected)
- `POST /api/portfolio/update-values` (protected)

## Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Socket.io for real-time updates
- Express-validator

**Frontend:**
- React 18
- React Router DOM
- Axios for HTTP requests
- Tailwind CSS for styling
- Recharts for visualizations
- React Toastify for notifications
- Context API for state management

## Key Features Highlights

1. **Secure Authentication**: JWT tokens with secure password hashing
2. **Real-Time Updates**: Stock prices update every 10 seconds
3. **Transaction Management**: Full CRUD for buy/sell operations
4. **Portfolio Tracking**: Real-time gain/loss calculations
5. **Data Validation**: Input validation on both frontend and backend
6. **Error Handling**: Comprehensive error messages and notifications
7. **Responsive Design**: Works seamlessly on all devices
8. **WebSocket Ready**: Socket.io integration for future real-time features

## Future Enhancements

- Leaderboard system for top performers
- AI-based stock recommendations
- Dark/Light mode toggle
- Advanced charting (candlestick charts)
- Watch lists
- Social features (follow traders)
- Mobile app
- Advanced filtering and sorting
- Portfolio export

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`

**Port Already in Use:**
- Change `PORT` in backend `.env` or kill the process on port 5000

**CORS Issues:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

**Stock List Empty:**
- Stock initialization happens automatically on first Stocks page visit
- Or manually visit `http://localhost:5000/api/stocks/init`

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the README files in the backend and frontend directories for more detailed information.



