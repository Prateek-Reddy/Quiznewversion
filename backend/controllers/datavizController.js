const pool = require('../config/db');

// Fetch all company rounds data
exports.getCompanyRounds = async (req, res) => {
  try {
    const query = 'SELECT * FROM company_rounds';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching company rounds:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all student hiring data (for the line chart)
exports.getAllStudentHiringData = async (req, res) => {
    try {
      const query = 'SELECT * FROM student_hiring;';
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
  // Get gender-wise data for a specific company (for the pie chart)
exports.getGenderWiseData = async (req, res) => {
    const { company } = req.query;
    try {
      const query = 'SELECT no_of_male_students, no_of_female_students FROM student_hiring WHERE company = $1;';
      const result = await pool.query(query, [company]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No data found for the selected company.' });
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
      res.json(result.rows.map(row => row.company));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get question count by subject for a specific company
exports.getQuestionCountBySubject = async (req, res) => {
    const { company } = req.params;
    try {
      const query = `
        SELECT course, COUNT(*) AS question_count
        FROM questions
        WHERE company = $1
        GROUP BY course;
      `;
      const result = await pool.query(query, [company]);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Helper function to fetch companies with a specific round type
const fetchCompaniesByRoundType = async (roundType) => {
  try {
    const columnMap = {
      aptitude: "aptitude_round",
      technical: "technical_round",
      managerial: "managerial_round",
      "technical-hr": "technical_hr_round",
      "group-discussion": "group_discussion",
      "online-coding": "online_coding_round",
      "written-coding": "written_coding_round",
    };

    const columnName = columnMap[roundType];
    if (!columnName) {
      throw new Error("Invalid round type.");
    }

    const query = `
      SELECT company, ${columnName} AS round_count
      FROM typeofrounds
      WHERE ${columnName} > 0;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from the database.");
  }
};

// Get companies with aptitude rounds
exports.getAptitudeRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("aptitude");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with technical rounds
exports.getTechnicalRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("technical");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with managerial rounds
exports.getManagerialRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("managerial");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with technical+HR rounds
exports.getTechnicalHrRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("technical-hr");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with group discussion rounds
exports.getGroupDiscussionRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("group-discussion");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with online coding rounds
exports.getOnlineCodingRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("online-coding");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get companies with written coding rounds
exports.getWrittenCodingRounds = async (req, res) => {
  try {
    const data = await fetchCompaniesByRoundType("written-coding");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//(company,role,salary)
// Fetch average salaries for all companies
exports.getAverageSalaries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT company, 
             AVG(salary::NUMERIC) AS average_salary
      FROM (
        SELECT company, 
               UNNEST(STRING_TO_ARRAY(salaries, '/')) AS salary
        FROM company_salaries
      ) AS salaries_expanded
      GROUP BY company;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching average salaries:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch all salaries for each company
exports.getAllSalaries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT company, roles, salaries
      FROM company_salaries
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all salaries:', error);
    res.status(500).json({ error: error.message });
  }
};

