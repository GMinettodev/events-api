const express = require('express');
const EventController = require('../controllers/eventController.js');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Public routes
router.get('/', EventController.getEvents);

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  EventController.createEvent
);

module.exports = router;
