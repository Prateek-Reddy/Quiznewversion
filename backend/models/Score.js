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
    const query = `
      DELETE FROM scores
      WHERE score_id = (
        SELECT score_id FROM scores
        WHERE user_id = $1
        ORDER BY timestamp ASC
        LIMIT 1
      );
    `;
    await pool.query(query, [userId]);
  },
  
    // Delete all scores for a user
  deleteAll: async (userId) => {
    const query = 'DELETE FROM scores WHERE user_id = $1;';
    await pool.query(query, [userId]);
  },
};

module.exports = Score;