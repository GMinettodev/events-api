const express = require('express');
const UserController = require('../controllers/usercontroller');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware.js');
const router = express.Router();

// Public routes
router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
