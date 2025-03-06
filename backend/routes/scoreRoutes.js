const express = require('express');
const scoreController = require('../controllers/scoreController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protect all score routes
router.use(authMiddleware);

// Save a new score
router.post('/', scoreController.saveScore);

// Get the last 10 scores for a user
router.get('/', scoreController.getScores);

// Get aggregated metrics for a user
router.get('/metrics', scoreController.getMetrics);

// Clear all scores and metrics for a user
router.delete('/clear', scoreController.clearScores);

module.exports = router;