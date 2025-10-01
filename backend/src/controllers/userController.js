const UserService = require('../services/userService');

class UserController {
  static async register(req, res, next) {
    try {
      const result = await UserService.registerUser(req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await UserService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await UserService.listUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await UserService.listUser(id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  static async editUser(req, res, next) {
    try {
      const result = await UserService.changeUser(req.params.id, req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async removeUser(req, res, next) {
    const { id } = req.params;

    try {
      const result = await UserService.removeUser(id);
      return res.status(200).json(result);
    } catch (err) {
      return next(err); // Will catch both 404 and 500
    }
  }
}

module.exports = UserController;
