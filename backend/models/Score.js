const pool = require('../config/db');

const Score = {
  // Save a new score
  create: async (userId, courseCode, company, score, totalQuestions) => {
    const query = `
      INSERT INTO scores (user_id, course_code, company, score, total_questions)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, courseCode, company, score, totalQuestions];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get the last 10 scores for a user
  getLast10: async (userId) => {
    const query = `
      SELECT * FROM scores
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 10;
    `;
    const result = await pool.query(query, [userId]);
    
    return result.rows;
  },

  // Delete the oldest score if the user has more than 10 scores
  deleteOldest: async (userId) => {
    try {
      // Log the oldest score before deletion
      const oldestScoreQuery = `
        SELECT * FROM scores
        WHERE user_id = $1
        ORDER BY timestamp ASC
        LIMIT 1;
      `;
      const oldestScoreResult = await pool.query(oldestScoreQuery, [userId]);
      console.log('Oldest score to delete:', oldestScoreResult.rows[0]);

      // Delete the oldest score
      const deleteQuery = `
        DELETE FROM scores
        WHERE score_id = (
          SELECT score_id FROM scores
          WHERE user_id = $1
          ORDER BY timestamp ASC
          LIMIT 1
        );
      `;
      const deleteResult = await pool.query(deleteQuery, [userId]);
      console.log('Deleted oldest attempt:', deleteResult.rowCount);
    } catch (error) {
      console.error('Error in deleteOldest:', error);
    }
  },
  
    // Delete all scores for a user
  deleteAll: async (userId) => {
    const query = 'DELETE FROM scores WHERE user_id = $1;';
    await pool.query(query, [userId]);
  },
};

module.exports = Score;