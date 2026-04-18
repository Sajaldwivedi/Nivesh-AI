# Stock Simulator Backend

This is the Node.js + Express.js backend for the Nivesh AI Stock Market Simulator.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/stock-simulator
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
STOCK_API_URL=https://api.example.com/stocks
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development (with hot reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will run on `http://localhost:5000`

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Stock Management**: Real-time stock data with price simulation
- **Trading System**: Buy and sell stocks with balance management
- **Portfolio Management**: Track user holdings and performance
- **Transaction History**: Complete record of all trades
- **WebSocket Support**: Real-time price updates using Socket.io
- **Input Validation**: Express-validator for API validation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout (protected)

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/init` - Initialize stocks
- `GET /api/stocks/id/:id` - Get stock by ID
- `GET /api/stocks/symbol/:symbol` - Get stock by symbol
- `POST /api/stocks/price-feed` - Simulate price feed

### Trading
- `POST /api/trades/buy` - Buy stock (protected)
- `POST /api/trades/sell` - Sell stock (protected)
- `GET /api/trades/transactions` - Get user transactions (protected)
- `GET /api/trades/history` - Get transaction history with pagination (protected)

### Portfolio
- `GET /api/portfolio` - Get user portfolio (protected)
- `GET /api/portfolio/summary` - Get portfolio summary (protected)
- `POST /api/portfolio/update-values` - Update portfolio values (protected)

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- balance: Number
- timestamps

### Stock
- symbol: String (unique, uppercase)
- name: String
- currentPrice: Number
- openPrice, highPrice, lowPrice: Number
- volume: Number
- priceHistory: Array
- timestamps

### Portfolio
- userId: ObjectId (ref User)
- holdings: Array of stocks with quantity, price, gain/loss
- totalInvested, totalCurrentValue, totalGainLoss
- timestamps

### Transaction
- userId: ObjectId (ref User)
- stockId: ObjectId (ref Stock)
- type: String (BUY/SELL)
- quantity, pricePerUnit, totalAmount: Number
- timestamp: Date

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Socket.io
- Express-validator
- CORS
- dotenv

## Development

Make sure MongoDB is running locally on `mongodb://localhost:27017` or update the MONGODB_URI in the .env file.
