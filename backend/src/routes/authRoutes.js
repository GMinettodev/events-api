const express = require('express');
const UserController = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRole,
} = require('../middlewares/authMiddleware.js');
const router = express.Router();

// Public routes

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authenticate user and return an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: Authentication successful, returns JWT token.
 *       401:
 *         description: Unauthorized, invalid credentials.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request, validation error.
 *       500:
 *         description: Internal server error.
 */

router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
