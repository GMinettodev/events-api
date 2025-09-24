const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

//Protected routes

// Public routes
router.post('/login', AuthController.login);

module.exports = router;
