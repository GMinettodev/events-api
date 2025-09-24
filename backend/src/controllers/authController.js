const UserService = require('../services/userService');
class AuthController {
  static async login(req, res, next) {
    try {
      const result = await UserService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AuthController;
