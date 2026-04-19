import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { portfolioAPI, stockAPI } from '../services/api';

const PortfolioContext = createContext();
let socket = null;

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data.portfolio);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch portfolio';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStocks = useCallback(async () => {
    try {
      const response = await stockAPI.getAllStocks();
      setStocks(response.data.stocks);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    }
  }, []);

  const updatePortfolioValues = useCallback(async () => {
    try {
      const response = await portfolioAPI.updatePortfolioValues();
      setPortfolio(response.data.portfolio);
    } catch (err) {
      console.error('Failed to update portfolio values:', err);
    }
  }, []);

  // Initialize WebSocket connection for real-time price updates
  useEffect(() => {
    try {
      // Connect to WebSocket server
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const baseUrl = apiUrl.replace('/api', '');
      socket = io(baseUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Listen for real-time stock price updates
      socket.on('stock-price-update', (updatedStocks) => {
        if (updatedStocks && Array.isArray(updatedStocks)) {
          setStocks(updatedStocks);
        }
      });

      socket.on('connect', () => {
        console.log('Connected to real-time price updates');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from real-time updates');
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    } catch (err) {
      console.log('WebSocket connection note:', err.message);
    }
  }, []);

  const value = {
    portfolio,
    stocks,
    loading,
    error,
    fetchPortfolio,
    fetchStocks,
    updatePortfolioValues,
    setPortfolio,
    setStocks,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};
