const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Get current user details (protected route)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;