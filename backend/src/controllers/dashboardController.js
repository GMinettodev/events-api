class DashboardController {
  static async getDashboard(req, res, next) {
    try {
      // Aqui espera-se que o middleware de autenticação já tenha setado o req.user
      const user = req.user;

      if (!user) {
        throw createError(401, 'Authentication required');
      }

      // Você pode chamar serviços que tragam dados específicos do dashboard,
      // por enquanto vamos só retornar dados básicos
      const dashboardData = {
        email: user.email,
        role: user.role,
        message: `Welcome to your dashboard, ${user.email}!`,
        // aqui você poderia incluir outras informações que desejar
      };

      res.status(200).json(dashboardData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
