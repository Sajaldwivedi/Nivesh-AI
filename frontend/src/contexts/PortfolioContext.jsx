import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { portfolioAPI, stockAPI } from '../services/api';

const PortfolioContext = createContext();

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
