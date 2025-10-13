const express = require('express');
const EventController = require('../controllers/eventController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', EventController.getEvents);
// Admin Only
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  EventController.createEvent
);

module.exports = router;
