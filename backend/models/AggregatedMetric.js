const pool = require('../config/db');

const AggregatedMetric = {
  // Update aggregated metrics for a user, course, and company
  update: async (userId, courseCode, company, score) => {
    // Check if metrics already exist
    const checkQuery = `
      SELECT * FROM aggregated_metrics
      WHERE user_id = $1 AND course_code = $2 AND company = $3;
    `;
    const checkResult = await pool.query(checkQuery, [userId, courseCode, company]);

    if (checkResult.rows.length === 0) {
      // Insert new metrics
      const insertQuery = `
        INSERT INTO aggregated_metrics (user_id, course_code, company, average_score, highest_score, total_attempts)
        VALUES ($1, $2, $3, $4, $5, 1);
      `;
      await pool.query(insertQuery, [userId, courseCode, company, score, score]);
    } else {
      // Update existing metrics
      const existing = checkResult.rows[0];
      const newTotalAttempts = existing.total_attempts + 1;
      const newAverageScore = (existing.average_score * existing.total_attempts + score) / newTotalAttempts;
      const newHighestScore = Math.max(existing.highest_score, score);

      const updateQuery = `
        UPDATE aggregated_metrics
        SET average_score = $1, highest_score = $2, total_attempts = $3
        WHERE user_id = $4 AND course_code = $5 AND company = $6;
      `;
      await pool.query(updateQuery, [newAverageScore, newHighestScore, newTotalAttempts, userId, courseCode, company]);
    }
  },

  // Get aggregated metrics for a user
  getByUser: async (userId) => {
    const query = `
      SELECT * FROM aggregated_metrics
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Delete all aggregated metrics for a user
  deleteAll: async (userId) => {
    const query = 'DELETE FROM aggregated_metrics WHERE user_id = $1;';
    await pool.query(query, [userId]);
  },
};

module.exports = AggregatedMetric;