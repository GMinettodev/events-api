const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const createError = require('http-errors');

class UserService {
  static validRoles = ['volunteer', 'admin'];

  static isRoleValid(role) {
    return UserService.validRoles.includes(role);
  }

  static async loginUser({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw createError(404, 'User not found');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw createError(400, 'Invalid password');
    }

    const token = jwt.sign(
      {
        // id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = UserService;
