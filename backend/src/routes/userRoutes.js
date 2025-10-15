const express = require('express');
const UserController = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:id', authenticateToken, UserController.getUserById);

// Admin Only
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  UserController.getUsers
);
router.get(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  UserController.getUserById
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  UserController.editUser
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  UserController.removeUser
);

module.exports = router;
