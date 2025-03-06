const Score = require('../models/Score');
const AggregatedMetric = require('../models/AggregatedMetric');

// Save a new score
exports.saveScore = async (req, res) => {
  const { courseCode, company, score, totalQuestions } = req.body;
  const userId = req.user.userId; // Get user ID from the token

  try {
    // Save the new score
    const newScore = await Score.create(userId, courseCode, company, score, totalQuestions);

    // Delete the oldest score if the user has more than 10 scores
    const scores = await Score.getLast10(userId);
    if (scores.length > 10) {
      await Score.deleteOldest(userId);
    }

    // Update aggregated metrics
    await AggregatedMetric.update(userId, courseCode, company, score);

    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the last 10 scores for a user
exports.getScores = async (req, res) => {
  const userId = req.user.userId; // Get user ID from the token

  try {
    const scores = await Score.getLast10(userId);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get aggregated metrics for a user
exports.getMetrics = async (req, res) => {
  const userId = req.user.userId; // Get user ID from the token

  try {
    const metrics = await AggregatedMetric.getByUser(userId);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear all scores and aggregated metrics for a user
exports.clearScores = async (req, res) => {
    const userId = req.user.userId; // Get user ID from the token
  
    try {
      // Delete all scores for the user
      await Score.deleteAll(userId);
  
      // Delete all aggregated metrics for the user
      await AggregatedMetric.deleteAll(userId);
  
      res.json({ message: 'All scores and metrics cleared successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };