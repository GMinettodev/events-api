const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const createError = require('http-errors');

class UserService {
  static validRoles = ['volunteer', 'admin'];

  static isRoleValid(role) {
    return UserService.validRoles.includes(role);
  }

  static async registerUser(user) {
    const { name, email, password, role = 'volunteer' } = user;

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw createError(400, 'User already exists');
    }

    // Validates the role only if it's provided
    if (user.role && !UserService.isRoleValid(user.role)) {
      throw createError(400, `Invalid role: ${role}`);
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;

    const id = await UserModel.create(user);

    return { message: 'User created successfully', id };
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

  static async changeUser(id, user) {
    const { name, email, password, role } = user;

    const hashed = await bcrypt.hash(password, 10);

    const result = await UserModel.update(id, {
      name,
      email,
      password: hashed,
      role,
    });

    // Validates the role only if it's provided
    if (user.role && !UserService.isRoleValid(user.role)) {
      throw createError(400, `Invalid role: ${role}`);
    }

    if (result.affectedRows === 0) {
      throw createError(404, 'User not found');
    }

    return { message: 'User updated successfully', id };
  }

  static async listUsers(req, res, next) {
    const users = await UserModel.findAll();
    return users;
  }

  static async listUser(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError(404, 'User not found');
    }
    return user;
  }

  static async removeUser(id) {
    const result = await UserModel.delete(id);

    if (result.affectedRows === 0) {
      throw createError(404, 'User not found');
    }

    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;
