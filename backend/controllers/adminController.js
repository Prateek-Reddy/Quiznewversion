// controllers/adminController.js
const xlsx = require('xlsx');
const pool = require('../config/db');
const path = require('path');

// Add a new question
exports.addQuestion = async (req, res) => {
  const { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer } = req.body;
  try {
    const query = `
      INSERT INTO questions (company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
    const { page = 1, limit = 10, company, course } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      let query = 'SELECT * FROM questions';
      const params = [];
      let whereClauses = [];
  
      // Add filters
      if (company) {
        whereClauses.push(`company = $${params.length + 1}`);
        params.push(company);
      }
      if (course) {
        whereClauses.push(`course = $${params.length + 1}`);
        params.push(course);
      }
  
      // Build the WHERE clause
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
  
      // Add pagination
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
  
      // Fetch questions
      const questionsResult = await pool.query(query, params);
  
      // Fetch total count for pagination
      const countQuery = 'SELECT COUNT(*) FROM questions';
      const countResult = await pool.query(countQuery);
  
      res.json({
        questions: questionsResult.rows,
        total: countResult.rows[0].count,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM questions WHERE question_id = $1;';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get distinct companies
exports.getDistinctCompanies = async (req, res) => {
    try {
      const result = await pool.query('SELECT DISTINCT company FROM questions;');
      res.json(result.rows.map((row) => row.company));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get distinct courses
exports.getDistinctCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT course FROM questions;');
    res.json(result.rows.map((row) => row.course));
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
  };

// Get course code based on course
exports.getCourseCodeByCourse = async (req, res) => {
  const { course } = req.query;
  try {
    const result = await pool.query('SELECT DISTINCT course_code FROM questions WHERE course = $1;', [course]);
    res.json(result.rows.map((row) => row.course_code));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a question
exports.editQuestion = async (req, res) => {
    const { id } = req.params;
    const { company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer } = req.body;
  
    try {
      const query = `
        UPDATE questions
        SET company = $1, course = $2, pyq = $3, concept = $4, course_code = $5, option_a = $6, option_b = $7, option_c = $8, option_d = $9, answer = $10
        WHERE question_id = $11
        RETURNING *;
      `;
      const values = [company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer, id];
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Delete a question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM questions WHERE question_id = $1;', [id]);
    res.json({ message: 'Question deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const query = 'SELECT * FROM users WHERE user_id = $1;';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a user
  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role } = req.body;
  
    try {
      const query = 'UPDATE users SET username = $1, role = $2 WHERE user_id = $3 RETURNING *;';
      const result = await pool.query(query, [username, role, id]);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const query = 'UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *;';
    const result = await pool.query(query, [role, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE user_id = $1;', [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalQuestions = await pool.query('SELECT COUNT(*) FROM questions;');
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users;');
    const totalAttempts = await pool.query('SELECT COUNT(*) FROM scores;');
    res.json({
      totalQuestions: totalQuestions.rows[0].count,
      totalUsers: totalUsers.rows[0].count,
      totalAttempts: totalAttempts.rows[0].count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a new curriculum analysis
exports.addCurriculumAnalysis = async (req, res) => {
  const { curriculum, syllabus_analysis, faculty_attention, course_id, subject_name } = req.body;
  try {
    const query = `
      INSERT INTO curriculum_analysis (curriculum, syllabus_analysis, faculty_attention, course_id, subject_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [curriculum, syllabus_analysis, faculty_attention, course_id, subject_name];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all curriculum analyses
exports.getAllCurriculumAnalyses = async (req, res) => {
  const { page = 1, limit = 10, subject_name } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM curriculum_analysis';
    const params = [];
    let whereClauses = [];

    // Add filters
    if (subject_name) {
      whereClauses.push(`subject_name = $${params.length + 1}`);
      params.push(subject_name);
    }

    // Build the WHERE clause
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add pagination
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Fetch curriculum analyses
    const result = await pool.query(query, params);

    // Fetch total count for pagination
    const countQuery = `SELECT COUNT(*) FROM curriculum_analysis ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}`;
    const countResult = await pool.query(countQuery, params.slice(0, whereClauses.length)); // Only pass filter params


    res.json({
      curriculumAnalyses: result.rows,
      total: countResult.rows[0].count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single curriculum analysis by ID
exports.getCurriculumAnalysisById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM curriculum_analysis WHERE cur_id = $1;';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curriculum analysis not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a curriculum analysis
exports.editCurriculumAnalysis = async (req, res) => {
  const { id } = req.params;
  const { curriculum, syllabus_analysis, faculty_attention, course_id, subject_name } = req.body;

  try {
    const query = `
      UPDATE curriculum_analysis
      SET curriculum = $1, syllabus_analysis = $2, faculty_attention = $3, course_id = $4, subject_name = $5
      WHERE cur_id = $6
      RETURNING *;
    `;
    const values = [curriculum, syllabus_analysis, faculty_attention, course_id, subject_name, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a curriculum analysis
exports.deleteCurriculumAnalysis = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM curriculum_analysis WHERE cur_id = $1;', [id]);
    res.json({ message: 'Curriculum analysis deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch distinct subject names
exports.getDistinctSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT subject_name FROM curriculum_analysis WHERE subject_name IS NOT NULL;'
    );
    res.json(result.rows.map(row => row.subject_name)); // Return only subject names
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload questions via Excel
exports.uploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Parse the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Validate and process each row
    for (const row of data) {
      const { COMPANY, COURSE, PYQ, CONCEPT, COURSE_CODE, OptionA, OptionB, OptionC, OptionD, Answer } = row;

      // Check if the course and course code match the database
      const courseCheck = await pool.query(
        'SELECT * FROM course_mapping WHERE course = $1 AND course_code = $2',
        [COURSE, COURSE_CODE]
      );
      console.log('Processing row:', { COURSE, COURSE_CODE });


      if (courseCheck.rows.length === 0) {
        return res.status(400).json({ error: `Invalid course or course code: ${COURSE} - ${COURSE_CODE}` });
      }

      // Insert the question into the database
      await pool.query(
        'INSERT INTO questions (company, course, pyq, concept, course_code, option_a, option_b, option_c, option_d, answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [COMPANY, COURSE, PYQ, CONCEPT, COURSE_CODE, OptionA, OptionB, OptionC, OptionD, Answer]
      );
    }

    res.status(200).json({ message: 'Questions uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading questions:', error);
    res.status(500).json({ error: 'Failed to upload questions.' });
  }
};

// Download a sample Excel sheet
exports.downloadSampleSheet = async (req, res) => {
  try {
    // Create a sample Excel sheet
    const sampleData = [
      {
        COMPANY: 'TechCorp',
        COURSE: 'DATA STRUCTURES',
        PYQ: 'What is the time complexity of binary search?',
        CONCEPT: 'Algorithms',
        COURSE_CODE: 'CSEN2001',
        OptionA: 'O(log n)',
        OptionB: 'O(n)',
        OptionC: 'O(n log n)',
        OptionD: 'O(1)',
        Answer: 'OptionA',
      },
      {
        COMPANY: 'SoftWorks',
        COURSE: 'OS',
        PYQ: 'What is the primary function of an OS kernel?',
        CONCEPT: 'OS Basics',
        COURSE_CODE: 'CSEN1101',
        OptionA: 'Manage hardware resources',
        OptionB: 'Execute user applications',
        OptionC: 'Compile programs',
        OptionD: 'Manage databases',
        Answer: 'OptionB',
      },
      {
        COMPANY: 'CodeGenius',
        COURSE: 'DBMS',
        PYQ: 'Which SQL command is used to delete data?',
        CONCEPT: 'SQL Queries',
        COURSE_CODE: 'CSEN2061',
        OptionA: 'DELETE',
        OptionB: 'REMOVE',
        OptionC: 'ERASE',
        OptionD: 'DROP',
        Answer: 'OptionC',
      },
      {
        COMPANY: 'DevSolutions',
        COURSE: 'CN',
        PYQ: 'What does HTTP stand for?',
        CONCEPT: 'Networking',
        COURSE_CODE: 'CSEN2021',
        OptionA: 'HyperText Transfer Protocol',
        OptionB: 'High-Level Text Protocol',
        OptionC: 'HyperText Transmission Protocol',
        OptionD: 'HyperText Transfer Process',
        Answer: 'OptionD',
      },
      {
        COMPANY: 'ByteCraft',
        COURSE: 'CLOUD COMPUTING',
        PYQ: 'Which service is provided by AWS S3?',
        CONCEPT: 'Cloud Services',
        COURSE_CODE: 'CSEN2121',
        OptionA: 'Storage',
        OptionB: 'Compute',
        OptionC: 'Networking',
        OptionD: 'Database',
        Answer: 'AllValid',
      },
      {
        COMPANY: 'InnovateIT',
        COURSE: 'SOFTWARE ENGINEERING',
        PYQ: 'Write a function to reverse a string.',
        CONCEPT: 'Programming',
        COURSE_CODE: 'CSEN1131',
        OptionA: 'Placeholder (coding question)',
        OptionB: 'Placeholder (coding question)',
        OptionC: 'Placeholder (coding question)',
        OptionD: 'Placeholder (coding question)',
        Answer: 'Placeholder',
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(sampleData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sample Questions');

    // Save the workbook to a file
    const filePath = path.join(__dirname, '../uploads/sample-questions.xlsx');
    xlsx.writeFile(workbook, filePath);

    // Send the file as a download
    res.download(filePath, 'sample-questions.xlsx', (err) => {
      if (err) {
        console.error('Error downloading sample sheet:', err);
        res.status(500).json({ error: 'Failed to download sample sheet.' });
      }
    });
  } catch (error) {
    console.error('Error generating sample sheet:', error);
    res.status(500).json({ error: 'Failed to generate sample sheet.' });
  }
};

// Download instructions file
exports.downloadInstructions = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/instructions.txt');

    // Send the file as a download
    res.download(filePath, 'instructions.txt', (err) => {
      if (err) {
        console.error('Error downloading instructions file:', err);
        res.status(500).json({ error: 'Failed to download instructions file.' });
      }
    });
  } catch (error) {
    console.error('Error generating instructions file:', error);
    res.status(500).json({ error: 'Failed to generate instructions file.' });
  }
}; 