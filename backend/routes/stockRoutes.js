const express = require('express');
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', stockController.getAllStocks);
router.get('/init', stockController.initializeStocks);
router.get('/id/:id', stockController.getStockById);
router.get('/symbol/:symbol', stockController.getStockBySymbol);
router.get('/quote/:symbol', stockController.getQuote);
router.get('/candles/:symbol', stockController.getCandles);
router.get('/search', stockController.searchSymbols);
router.post('/price-feed', stockController.simulatePriceFeed);

// Protected routes
router.put('/update/:id', authMiddleware, stockController.updateStockPrice);

module.exports = router;
