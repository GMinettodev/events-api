const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Authenticated user can view/edit their own profile
router.get('/:id', authenticateToken, UserController.getUserById);
router.put('/:id', authenticateToken, UserController.editUser);

module.exports = router;
