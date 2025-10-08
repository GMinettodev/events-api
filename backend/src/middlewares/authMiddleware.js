const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // assuming this exists


async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    try {
      // Buscar o usuário completo pelo email do token
      const user = await UserModel.findByEmail(decoded.email);
      if (!user) return res.status(401).json({ message: 'User not found' });

      // Garantir que req.user tem o id, role, email, name, etc.
      req.user = user;
      next();
    } catch (dbErr) {
      next(dbErr);
    }
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
