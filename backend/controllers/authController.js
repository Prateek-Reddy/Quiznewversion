const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, password, role } = req.body;
  
    // Validate role (only allow 'student' during registration)
    if (role !== 'student') {
      return res.status(400).json({ error: 'Invalid role. Only students can register.' });
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      const user = await User.create(username, hashedPassword, role);
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username, role: user.role }, // Include username
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findByUsername(username);
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      // Compare passwords
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username, role: user.role }, // Include username
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get current user details
exports.getMe = async (req, res) => {
    try {
      console.log('Decoded user from token:', req.user); // Log the decoded token
      const user = await User.findById(req.user.userId); // Use userId to find the user
      if (!user) {
        console.log('User not found in database'); // Log if user is not found
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('User found:', user); // Log the user data
      res.json(user);
    } catch (error) {
      console.error('Error in getMe:', error); // Log any errors
      res.status(500).json({ error: error.message });
    }
  };