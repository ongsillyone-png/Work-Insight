const activityService = require('../services/activity.service');
const activityMasterService = require('../services/activity-master.service');
const locationService = require('../services/location.service');
const dashboardService = require('../services/dashboard.service');
const { getLocalDateString } = require('../utils/date');

class HomeController {
  async renderHome(req, res, next) {
    try {
      const userId = req.user?.id || 1;
      const { range, start, end } = req.query;

      // 1. Get quick actions limit from system settings
      const limit = res.locals.systemSettings?.max_quick_actions || 6;

      const allMasters = await activityMasterService.getAllActivities();
      
      let favorites = [];
      if (req.user && req.user.quick_actions) {
        const quickActionIds = req.user.quick_actions.split(',').map(s => s.trim()).filter(Boolean);
        favorites = quickActionIds
          .map(id => allMasters.find(am => am.id.toString() === id))
          .filter(Boolean)
          .slice(0, limit)
          .map(am => ({
            id: am.id,
            name: am.name,
            code: am.code,
            activity_master_id: am.id
          }));
      }

      // If user doesn't have any favorites yet, fall back to the first active master activities up to the limit
      if (favorites.length === 0) {
        favorites = allMasters.slice(0, limit).map(am => ({
          id: am.id,
          name: am.name,
          code: am.code,
          activity_master_id: am.id
        }));
      }

      // 2. Fetch logged activities for today
      const todayStr = getLocalDateString();
      const allUserLogs = await activityService.getLoggedActivities(userId);
      const recents = allUserLogs.filter(log => log.date === todayStr);

      // 3. Calculate summary stats for today
      const activityCount = recents.length;
      const totalMinutes = recents.reduce((sum, log) => sum + parseInt(log.duration || 0, 10), 0);
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

      const summary = {
        activityCount,
        totalHours,
        totalMinutes
      };

      // 4. Fetch all active master activities for search autocomplete
      const activities = await activityMasterService.getAllActivities();

      // 5. Fetch all locations for physical locations drop-down
      const locations = await locationService.getAllLocations();

      // 6. Calculate date range and fetch personal activity distribution
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

      const personalDistribution = await dashboardService.getPersonalDistribution(userId, startDate, endDate);

      return res.render('layouts/main', {
        body: '../home/index',
        title: 'หน้าแรก | Work Insight',
        favorites,
        recents,
        summary,
        activities,
        locations,
        personalDistribution,
        query: {
          range: selectedRange,
          start: start || today,
          end: end || today,
          startDate,
          endDate
        },
        activeMenu: 'home'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HomeController();
