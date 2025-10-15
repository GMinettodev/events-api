const express = require('express');
const EventController = require('../controllers/eventController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes

/**
 * @swagger
 * /events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Retrieves all events
 *     responses:
 *       "200":
 *         description: Successfully retrieved events
 *       "500":
 *         description: Server error
 */

router.get('/', EventController.getEvents);

//Protected routes

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Creates a new event (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: Event created successfully
 *       "401":
 *         description: Unauthorized - Token missing or invalid
 *       "403":
 *         description: Forbidden - Insufficient permissions
 *       "400":
 *         description: Bad request - Validation errors
 *       "500":
 *         description: Server error
 */
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
