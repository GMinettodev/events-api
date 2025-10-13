const express = require('express');
const UserController = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// ✅ Authenticated user can view/edit their own profile
router.get('/:id', authenticateToken, UserController.getUserById);
// router.put('/:id', authenticateToken, UserController.editUser);

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
