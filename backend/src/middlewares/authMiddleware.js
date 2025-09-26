const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // assuming this exists

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401);
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    try {
      const user = await UserModel.findByEmail(decoded.email);
      if (!user) return res.status(401).json({ message: 'User not found' });

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
