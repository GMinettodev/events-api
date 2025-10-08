const express = require('express');
const UserController = require('../controllers/userController');
const EventController = require('../controllers/eventController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected
router.use(authenticateToken, authorizeRole('admin'));

// Event management
router.post('/events', EventController.createEvent);

// Full user management
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.editUser);
router.delete('/users/:id', UserController.removeUser);

module.exports = router;
