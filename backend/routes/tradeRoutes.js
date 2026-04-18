const express = require('express');
const tradeController = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes - all trade routes require authentication
router.post('/buy', authMiddleware, tradeController.buyStock);
router.post('/sell', authMiddleware, tradeController.sellStock);
router.get('/transactions', authMiddleware, tradeController.getTransactions);
router.get('/history', authMiddleware, tradeController.getTransactionHistory);

module.exports = router;
