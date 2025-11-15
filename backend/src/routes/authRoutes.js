const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Login route
router.post('/login', authController.login);

// Get current user (protected)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;

