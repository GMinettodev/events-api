const express = require('express');
const EventController = require('../controllers/eventController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', EventController.getEvents);

//Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  EventController.createEvent
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  EventController.updateEvent
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  EventController.deleteEvent
);

module.exports = router;
