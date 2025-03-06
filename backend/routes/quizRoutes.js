const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

router.get('/distinct', quizController.getDistinct);
router.get('/questions', quizController.getQuestions);
router.get('/questions/all', quizController.getAllQuestions);
router.post('/submit', quizController.submitQuiz);

module.exports = router;