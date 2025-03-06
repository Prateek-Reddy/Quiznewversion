const pool = require('../config/db'); // Import the pool object

const User = {
  // Create a new user
  create: async (username, password, role) => {
    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [username, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Find a user by username
  findByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1;';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // Find a user by user_id
  findById: async (userId) => {
    const query = 'SELECT * FROM users WHERE user_id = $1;';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },
};

module.exports = User;