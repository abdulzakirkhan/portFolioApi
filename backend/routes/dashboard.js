const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.get('/stats', protect, getStats);

module.exports = router;
