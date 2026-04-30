const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST http://localhost:5000/api/register
router.post('/register', authController.registerUser);

// POST http://localhost:5000/api/login
router.post('/login', authController.loginUser);

module.exports = router;