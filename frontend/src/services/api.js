import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const stockAPI = {
  getAllStocks: () => api.get('/stocks'),
  initializeStocks: () => api.get('/stocks/init'),
  getStockById: (id) => api.get(`/stocks/id/${id}`),
  getStockBySymbol: (symbol) => api.get(`/stocks/symbol/${symbol}`),
  simulatePriceFeed: () => api.post('/stocks/price-feed'),
};

export const tradeAPI = {
  buyStock: (data) => api.post('/trades/buy', data),
  sellStock: (data) => api.post('/trades/sell', data),
  getTransactions: () => api.get('/trades/transactions'),
  getTransactionHistory: (page = 1, limit = 10) =>
    api.get(`/trades/history?page=${page}&limit=${limit}`),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  updatePortfolioValues: () => api.post('/portfolio/update-values'),
  getPortfolioSummary: () => api.get('/portfolio/summary'),
};

export default api;
