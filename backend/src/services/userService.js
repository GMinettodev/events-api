const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

class UserService {
  /**
   * @description Registers a new user, including checking for existence and hashing the password.
   * @param {object} userData - User registration data.
   * @returns {Promise<{message: string, id: number}>} Success message and new user ID.
   */
  static async registerUser(userData) {
    const existing = await UserModel.findByEmail(userData.email);
    if (existing) throw createError(400, 'User already exists');

    // Business rule: Password hashing remains here
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = { ...userData, password: hashedPassword };
    
    // Call the Model (now using Prisma)
    const id = await UserModel.create(newUser);
    return { message: 'User created successfully', id };
  }

  /**
   * @description Handles user login by checking credentials and generating a JWT.
   * @param {object} credentials - User email and password.
   * @returns {Promise<{token: string, user: object}>} JWT and basic user info.
   */
  static async loginUser({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw createError(404, 'User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw createError(400, 'Invalid password');

    // JWT logic remains the same
    const jwt = require('jsonwebtoken'); 
    const token = jwt.sign(
      { email: user.email, role: user.role, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { email: user.email, role: user.role, id: user.id } };
  }

  /**
   * @description Retrieves a list of all users.
   * @returns {Promise<User[]>} Array of user objects.
   */
  static async listUsers() {
    return UserModel.findAll();
  }

  /**
   * @description Retrieves a single user by ID, omitting the password.
   * @param {number} id - The user's ID.
   * @returns {Promise<object>} User data without password.
   */
  static async listUser(id) {
    const user = await UserModel.findById(id);
    if (!user) throw createError(404, 'User not found');
    
    // Use destructuring to omit the password field
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * @description Updates a user's information.
   * @param {number} id - The user's ID.
   * @param {object} userData - Data to update.
   * @returns {Promise<{message: string}>} Success message.
   */
  static async changeUser(id, userData) {
    // Rule from PDF section 3.5: Check existence before updating
    const existing = await UserModel.findById(id);
    if (!existing) throw createError(404, 'User not found');

    if (userData.password) {
      // Hash the password if a new one is provided
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await UserModel.update(id, userData);
    return { message: 'User updated successfully' };
  }

  /**
   * @description Deletes a user.
   * @param {number} id - The user's ID.
   * @returns {Promise<{message: string}>} Success message.
   */
  static async removeUser(id) {
    // Rule from PDF section 3.6: Check existence before deleting
    const existing = await UserModel.findById(id);
    if (!existing) throw createError(404, 'User not found');

    await UserModel.delete(id);
    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;