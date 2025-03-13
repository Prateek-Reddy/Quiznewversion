const express = require('express');
const datavizController = require('../controllers/datavizController');
const router = express.Router();

router.get('/company-rounds', datavizController.getCompanyRounds);//onlinevsOffline
router.get('/student-hiring', datavizController.getAllStudentHiringData); // Get all student hiring data
router.get('/gender-wise-data', datavizController.getGenderWiseData); // Get gender-wise data for a specific company
router.get('/distinct-companies', datavizController.getDistinctCompanies);// Get distinct companies
router.get('/question-count-by-subject/:company', datavizController.getQuestionCountBySubject);// Get question count by subject for a specific company
// Define routes for each round type
router.get('/rounds/aptitude', datavizController.getAptitudeRounds);
router.get('/rounds/technical', datavizController.getTechnicalRounds);
router.get('/rounds/managerial', datavizController.getManagerialRounds);
router.get('/rounds/technical-hr', datavizController.getTechnicalHrRounds);
router.get('/rounds/group-discussion', datavizController.getGroupDiscussionRounds);
router.get('/rounds/online-coding', datavizController.getOnlineCodingRounds);
router.get('/rounds/written-coding', datavizController.getWrittenCodingRounds);
//company salaries
router.get('/average-salaries', datavizController.getAverageSalaries);
router.get('/all-salaries', datavizController.getAllSalaries);



module.exports = router;