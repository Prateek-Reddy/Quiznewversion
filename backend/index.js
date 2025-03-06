const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/curriculum', curriculumRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});