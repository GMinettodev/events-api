class DashboardController {
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
