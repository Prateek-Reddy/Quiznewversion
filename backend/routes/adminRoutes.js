// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const upload = require('../config/multer');

// Apply authMiddleware first to ensure req.user is populated
router.use(authMiddleware);

// Protect all admin routes
router.use(adminMiddleware);

// Question Management
router.post('/questions', adminController.addQuestion);
router.get('/questions', adminController.getAllQuestions);
router.get('/questions/:id', adminController.getQuestionById);
router.get('/distinct/companies', adminController.getDistinctCompanies);
router.get('/distinct/courses', adminController.getDistinctCourses);
router.get('/course-code', authMiddleware, adminController.getCourseCodeByCourse);
router.put('/questions/:id', adminController.editQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);
// Add route for uploading questions via Excel
router.post('/upload-questions', upload.single('file'), adminController.uploadQuestions);
// Add route for downloading sample sheet
router.get('/download-sample-sheet', adminController.downloadSampleSheet);
// Add route for downloading instructions file
router.get('/download-instructions', adminController.downloadInstructions);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Curriculum Analysis Management
router.post('/curriculum-analyses', adminController.addCurriculumAnalysis);
router.get('/curriculum-analyses', adminController.getAllCurriculumAnalyses);
router.get('/curriculum-analyses/:id', adminController.getCurriculumAnalysisById);
router.put('/curriculum-analyses/:id', adminController.editCurriculumAnalysis);
router.delete('/curriculum-analyses/:id', adminController.deleteCurriculumAnalysis);
router.get('/distinct-subjects', adminController.getDistinctSubjects);

// Analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;