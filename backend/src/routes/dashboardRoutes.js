const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware.js');
const EventController = require('../controllers/EventController');

// Public routes
router.get('/', EventController.getEvents);

// Protected routes
// router.get('/', authenticateToken, EventController.getDashboardEvents);
router.get('/dashboard', authenticateToken, EventController.getDashboardEvents);

module.exports = router;
