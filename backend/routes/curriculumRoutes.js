// routes/curriculumRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const curriculumController = require('../controllers/curriculumController');

// Apply authMiddleware to protect routes
router.use(authMiddleware);

// Get curriculum analyses (filter by subject_name)
router.get('/curriculum-analyses', curriculumController.getCurriculumAnalyses);
router.get('/distinct-subjects', curriculumController.getDistinctSubjects);

module.exports = router;