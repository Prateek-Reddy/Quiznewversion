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

// Company Rounds Management
router.post('/company-rounds', adminController.addCompanyRounds); // Add new company rounds
router.get('/company-rounds', adminController.getAllCompanyRounds); // Get all company rounds (with pagination and filtering)
router.get('/company-rounds/:id', adminController.getCompanyRoundsById); // Get a single company round by ID
router.put('/company-rounds/:id', adminController.editCompanyRounds); // Edit a company round
router.delete('/company-rounds/:id', adminController.deleteCompanyRounds); // Delete a company round
router.get('/distinct-companies', adminController.getDistinctCompaniesForCompanyRounds); // Get distinct company names for filtering

// Student Hiring Management
router.post('/student-hiring', adminController.addStudentHiring); // Add a new record
router.get('/student-hiring', adminController.getAllStudentHiring); // Get all records (with pagination and filtering)
router.put('/student-hiring/:id', adminController.editStudentHiring); // Edit a record
router.delete('/student-hiring/:id', adminController.deleteStudentHiring); // Delete a record
router.get('/distinctcompanies', adminController.getDistinctCompaniesForStudentHiring); // Get distinct company names for filtering

// Type of Rounds Management
router.post('/typeofrounds', adminController.addTypeOfRounds); // Add a new record
router.get('/typeofrounds', adminController.getAllTypeOfRounds); // Get all records (with pagination and filtering)
router.put('/typeofrounds/:id', adminController.editTypeOfRounds); // Edit a record
router.delete('/typeofrounds/:id', adminController.deleteTypeOfRounds); // Delete a record
router.get('/typeofrounds/distinct-companies', adminController.getDistinctCompaniesForTypeOfRounds); // Get distinct companies

// Company Salaries Routes
router.post('/company-salaries', adminController.addCompanySalaries);
router.put('/company-salaries/:id', adminController.editCompanySalaries);
router.delete('/company-salaries/:id', adminController.deleteCompanySalaries);
router.get('/company-salaries', adminController.getAllCompanySalaries);
router.get('/company-salaries/distinct-companies', adminController.getDistinctCompaniesForCompanySalaries);

// Analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;