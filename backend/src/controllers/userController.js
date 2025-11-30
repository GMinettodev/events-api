const UserService = require('../services/userService');

/**
 * Handles HTTP requests for user management, including registration, login,
 * retrieval, update, and deletion of user data.
 */
class UserController {
  /**
   * @description Registers a new user.
   * @route POST /auth/register
   */
  static async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await UserService.registerUser(userData);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logs in a user.
   * @param {Object} req - Express request object, expects email and password in req.body.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function for error handling.
   * @returns {Promise<void>} JSON response with authentication token and user info.
   */
  static async login(req, res, next) {
    try {
      const result = await UserService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Retrieves a list of all users.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function for error handling.
   * @returns {Promise<void>} JSON response with the list of users.
   */
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.listUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Retrieves a user by ID.
   * @param {Object} req - Express request object, expects user ID in req.params.id.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function for error handling.
   * @returns {Promise<void>} JSON response with the user data.
   */
  static async getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await UserService.listUser(id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Updates a user's information.
   * @param {Object} req - Express request object, expects user ID in req.params.id and update data in req.body.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function for error handling.
   * @returns {Promise<void>} JSON response with the update result.
   */
  static async editUser(req, res, next) {
    try {
      const result = await UserService.changeUser(req.params.id, req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @description Deletes a user by ID. Requires 'admin' role.
   * @route DELETE /users/:id
   */
  static async removeUser(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.removeUser(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
