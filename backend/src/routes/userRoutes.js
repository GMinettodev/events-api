const express = require('express');
const UserController = require('../controllers/usercontroller');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware.js');
const router = express.Router();

// Protected routes
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  UserController.getUsers
);
router.get('/:id', authenticateToken, UserController.getUserById);
router.put('/:id', authenticateToken, UserController.editUser);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  UserController.removeUser
);

module.exports = router;
