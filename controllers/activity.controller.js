const activityService = require('../services/activity.service');
const activityMasterService = require('../services/activity-master.service');
const locationService = require('../services/location.service');
const categoryService = require('../services/category.service');
const { getLocalDateString } = require('../utils/date');

class ActivityController {
  async renderIndex(req, res, next) {
    try {
      const { date, session, search } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      
      const allLogs = await activityService.getLoggedActivities(req.user?.id || 1, { date, session, search });
      
      // Group by date to paginate by "days"
      const uniqueDates = [...new Set(allLogs.map(log => log.date))];
      const latestDate = uniqueDates[0] || null;
      const limitDays = 10;
      const totalPages = Math.ceil(uniqueDates.length / limitDays) || 1;
      const currentPage = Math.min(page, totalPages);
      
      // Get the dates for the current page
      const pageDates = uniqueDates.slice((currentPage - 1) * limitDays, currentPage * limitDays);
      
      // Filter logs to only include those on the page's dates
      const logs = allLogs.filter(log => pageDates.includes(log.date));

      return res.render('layouts/main', {
        body: '../activity/index',
        title: 'Activity Logs | Work Insight',
        logs,
        latestDate,
        query: req.query || {},
        pagination: {
          currentPage,
          totalPages,
          totalDays: uniqueDates.length
        },
        activeMenu: 'activity'
      });
    } catch (err) {
      next(err);
    }
  }

  async renderCreate(req, res, next) {
    try {
      const userId = req.user?.id || 1;
      let activities = await activityMasterService.getAllActivities();
      const locations = await locationService.getAllLocations();
      let categories = await categoryService.getAllCategories();
      
      if (req.user && req.user.managed_categories) {
        const managedIds = req.user.managed_categories.split(',').map(id => id.trim());
        categories = categories.filter(c => managedIds.includes(c.id.toString()));
        activities = activities.filter(a => a.category_id && managedIds.includes(a.category_id.toString()));
      } else if (req.user && req.user.role_id !== 1) {
        // If not Admin and no managed categories, they shouldn't see any
        categories = [];
        activities = [];
      }
      
      const todayStr = getLocalDateString();
      const allUserLogs = await activityService.getLoggedActivities(userId);
      const recents = allUserLogs.filter(log => log.date === todayStr);
      const todayTotalMinutes = recents.reduce((sum, log) => sum + parseInt(log.duration || 0, 10), 0);

      return res.render('layouts/main', {
        body: '../activity/create',
        title: 'Log New Activity | Work Insight',
        activities,
        locations,
        categories,
        todayTotalMinutes,
        activeMenu: 'record_activity'
      });
    } catch (err) {
      next(err);
    }
  }

  async renderEdit(req, res, next) {
    try {
      const logId = req.params.id;
      const log = await activityService.getActivityById(logId);
      const activities = await activityMasterService.getAllActivities();
      const locations = await locationService.getAllLocations();
      return res.render('layouts/main', {
        body: '../activity/edit',
        title: 'Edit Activity Log | Work Insight',
        log,
        activities,
        locations,
        activeMenu: 'activity'
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Handle Logging Form Submissions ---
  async createLog(req, res, next) {
    try {
      const { activityMasterId, logDate, session, duration, locationId, output, remark } = req.body;
      await activityService.createActivity({
        user_id: req.user?.id || 1,
        activityMasterId,
        logDate,
        session,
        duration,
        locationId,
        output,
        remark
      });
      return res.redirect('/activity?success=create');
    } catch (err) {
      next(err);
    }
  }

  async updateLog(req, res, next) {
    try {
      const { id } = req.params;
      const { activityMasterId, logDate, session, duration, locationId, output, remark } = req.body;
      await activityService.updateActivity(id, {
        activityMasterId,
        logDate,
        session,
        duration,
        locationId,
        output,
        remark
      });
      return res.redirect('/activity?success=update');
    } catch (err) {
      next(err);
    }
  }

  async deleteLog(req, res, next) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(id);
      return res.json({ success: true, message: 'ลบบันทึกประวัติเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ActivityController();
