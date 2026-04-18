const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes - all portfolio routes require authentication
router.get('/', authMiddleware, portfolioController.getPortfolio);
router.get('/summary', authMiddleware, portfolioController.getPortfolioSummary);
router.post('/update-values', authMiddleware, portfolioController.updatePortfolioValues);

module.exports = router;
