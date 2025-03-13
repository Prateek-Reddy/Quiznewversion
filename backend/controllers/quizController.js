const pool = require('../config/db');

// Get distinct courses and companies
exports.getDistinct = async (req, res) => {
  try {
    console.log('Fetching distinct courses and companies...');

    // Fetch distinct courses
    const coursesQuery = 'SELECT DISTINCT course FROM questions;';
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult.rows.map(row => row.course);

    // Fetch distinct companies
    const companiesQuery = 'SELECT DISTINCT company FROM questions;';
    const companiesResult = await pool.query(companiesQuery);
    const companies = companiesResult.rows.map(row => row.company);

    
    res.json({ courses, companies });
  } catch (error) {
    console.error('Error in getDistinct:', error); // Log the full error
    res.status(500).json({ error: error.message });
  }
};

// Get filtered questions
exports.getQuestions = async (req, res) => {
  const { course, company, limit = 10 } = req.query;
  try {
    let query = 'SELECT * FROM questions';
    const params = [];

    // Add filters if provided
    if (course || company) {
      query += ' WHERE';
      if (course) {
        query += ' course = $1';
        params.push(course);
      }
      if (company) {
        if (course) query += ' AND';
        query += ' company = $' + (params.length + 1);
        params.push(company);
      }
    }

    // Add limit and random order
    query += ' ORDER BY RANDOM() LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));

    console.log('Executing query:', query, params);
    const result = await pool.query(query, params);

    // Check if no questions were found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No questions found for the selected filters.' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all questions with pagination
exports.getAllQuestions = async (req, res) => {
  const { course, company, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM questions';
    const params = [];

    // Add filters if provided
    if (course || company) {
      query += ' WHERE';
      if (course) {
        query += ' course = $1';
        params.push(course);
      }
      if (company) {
        if (course) query += ' AND';
        query += ' company = $' + (params.length + 1);
        params.push(company);
      }
    }

    // Add pagination
    query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), offset);

    console.log('Executing query:', query, params);
    const result = await pool.query(query, params);

    // Get total count for pagination
    const countQuery = 'SELECT COUNT(*) FROM questions';
    const countResult = await pool.query(countQuery);
    const total = countResult.rows[0].count;

    res.json({
      questions: result.rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error in getAllQuestions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Submit quiz and calculate score
exports.submitQuiz = async (req, res) => {
  const { answers, questionIds } = req.body; // Array of { question_id, selectedOption } and list of question IDs

  try {
    console.log('Received answers:', answers); // Log the received answers
    console.log('Received question IDs:', questionIds); // Log the received question IDs

    let score = 0;

    // Fetch only the questions that were part of the quiz
    const questionsQuery = 'SELECT * FROM questions WHERE question_id = ANY($1);';
    const questionsResult = await pool.query(questionsQuery, [questionIds]);
    const questions = questionsResult.rows;

    console.log('Fetched questions:', questions); // Log the fetched questions

    // Calculate the score
    answers.forEach((answer) => {
      const question = questions.find((q) => q.question_id === answer.question_id);

      // Check if the question has "Placeholder" in options or answer
      const hasPlaceholder =
        question.option_a.includes('Placeholder') ||
        question.option_b.includes('Placeholder') ||
        question.option_c.includes('Placeholder') ||
        question.option_d.includes('Placeholder') ||
        question.answer.includes('Placeholder');

      if (hasPlaceholder) {
        // Automatically mark as correct if the question has "Placeholder"
        score += 1;
      } else {
        // Otherwise, compare the selected option with the correct answer
        const selectedOptionFormatted = `Option${answer.selectedOption}`;
        if (selectedOptionFormatted === question.answer) {
          score += 1;
        }
      }
    });

    console.log('Calculated score:', score); // Log the calculated score

    res.json({ score, total: questions.length });
  } catch (error) {
    console.error('Error in submitQuiz:', error);
    res.status(500).json({ error: error.message });
  }
};