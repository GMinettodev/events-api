const createError = require('http-errors');

/**
 * Controller responsible for handling requests related to the user dashboard.
 */
class DashboardController {
  /**
   * Retrieves dashboard information for the authenticated user.
   * Requires user authentication.
   * @param {Object} req - Express request object, expects user info in req.user.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  static async getDashboard(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        throw createError(401, 'Authentication required');
      }

      const dashboardData = {
        email: user.email,
        role: user.role,
        message: `Welcome to your dashboard, ${user.email}!`,
      };

      res.status(200).json(dashboardData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
