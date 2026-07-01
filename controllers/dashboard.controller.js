const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async renderDashboard(req, res, next) {
    try {
      const { range, start, end } = req.query;
      
      const getLocalDateString = (d = new Date()) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      let startDate, endDate;
      const today = getLocalDateString();
      
      let selectedRange = range || 'today';
      
      if (selectedRange === 'today') {
        startDate = today;
        endDate = today;
      } else if (selectedRange === 'week') {
        const date = new Date();
        date.setDate(date.getDate() - 6);
        startDate = getLocalDateString(date);
        endDate = today;
      } else if (selectedRange === 'month') {
        const date = new Date();
        date.setDate(date.getDate() - 29);
        startDate = getLocalDateString(date);
        endDate = today;
      } else if (selectedRange === 'custom') {
        startDate = start || today;
        endDate = end || today;
      }

      const analytics = await dashboardService.getDashboardAnalytics({ startDate, endDate });

      return res.render('layouts/main', {
        body: '../dashboard/index',
        title: 'Dashboard | Work Insight',
        analytics,
        query: {
          range: selectedRange,
          start: start || today,
          end: end || today,
          startDate,
          endDate
        },
        activeMenu: 'dashboard'
      });
    } catch (err) {
      next(err);
    }
  }

  async getExportData(req, res, next) {
    try {
      const { range, start, end } = req.query;
      
      const getLocalDateString = (d = new Date()) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      let startDate, endDate;
      const today = getLocalDateString();
      
      let selectedRange = range || 'today';
      if (selectedRange === 'today') {
        startDate = today;
        endDate = today;
      } else if (selectedRange === 'week') {
        const date = new Date();
        date.setDate(date.getDate() - 6);
        startDate = getLocalDateString(date);
        endDate = today;
      } else if (selectedRange === 'month') {
        const date = new Date();
        date.setDate(date.getDate() - 29);
        startDate = getLocalDateString(date);
        endDate = today;
      } else if (selectedRange === 'custom') {
        startDate = start || today;
        endDate = end || today;
      }

      const logs = await dashboardService.getDetailedLogs(startDate, endDate);
      return res.json({ success: true, logs });
    } catch (err) {
      console.error('Error in getExportData:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve detailed logs' });
    }
  }
}

module.exports = new DashboardController();
