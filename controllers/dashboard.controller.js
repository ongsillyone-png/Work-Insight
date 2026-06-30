const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async renderDashboard(req, res, next) {
    try {
      const analytics = await dashboardService.getDashboardAnalytics();
      return res.render('layouts/main', {
        body: '../dashboard/index',
        title: 'Dashboard | Work Insight',
        analytics,
        activeMenu: 'dashboard'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
