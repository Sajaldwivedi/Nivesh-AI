# Stock Simulator Frontend

This is the React frontend for the Nivesh AI Stock Market Simulator, built with Vite.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Features

- **User Authentication**: Register and login with email and password
- **Stock Market**: Browse and view real-time stock prices
- **Trading System**: Buy and sell stocks with virtual balance
- **Portfolio Management**: Track your holdings and performance
- **Dashboard**: View portfolio overview with charts
- **Transaction History**: View all your trades
- **Responsive Design**: Works on all devices with Tailwind CSS

## Environment Variables

The frontend will automatically proxy API requests to `http://localhost:5000`.

Make sure the backend server is running on port 5000.

## Technology Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- React Toastify
- Socket.io Client
