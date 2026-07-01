const activityService = require('../services/activity.service');
const activityMasterService = require('../services/activity-master.service');
const locationService = require('../services/location.service');
const categoryService = require('../services/category.service');

class ActivityController {
  async renderIndex(req, res, next) {
    try {
      const { date, session, search } = req.query;
      const logs = await activityService.getLoggedActivities(req.user?.id || 1, { date, session, search });
      return res.render('layouts/main', {
        body: '../activity/index',
        title: 'Activity Logs | Work Insight',
        logs,
        query: req.query || {},
        activeMenu: 'activity'
      });
    } catch (err) {
      next(err);
    }
  }

  async renderCreate(req, res, next) {
    try {
      const activities = await activityMasterService.getAllActivities();
      const locations = await locationService.getAllLocations();
      const categories = await categoryService.getAllCategories();
      return res.render('layouts/main', {
        body: '../activity/create',
        title: 'Log New Activity | Work Insight',
        activities,
        locations,
        categories,
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
      return res.redirect('/activity');
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
      return res.redirect('/activity');
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
