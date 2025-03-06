// controllers/curriculumController.js
const pool = require('../config/db');

// Get all curriculum analyses (filter by subject_name)
exports.getCurriculumAnalyses = async (req, res) => {
  const { subject_name } = req.query;
  try {
    let query = 'SELECT * FROM curriculum_analysis';
    const params = [];

    if (subject_name) {
      query += ' WHERE subject_name = $1';
      params.push(subject_name);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDistinctSubjects = async (req, res) => {
    try {
      const query = 'SELECT DISTINCT subject_name FROM curriculum_analysis';
      const result = await pool.query(query);
      res.json(result.rows.map(row => row.subject_name));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };