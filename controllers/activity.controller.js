const activityService = require('../services/activity.service');

class ActivityController {
  async renderIndex(req, res, next) {
    try {
      const logs = await activityService.getLoggedActivities(req.user?.id);
      return res.render('layouts/main', {
        body: '../activity/index',
        title: 'Activity Logs | Work Insight',
        logs,
        activeMenu: 'activity'
      });
    } catch (err) {
      next(err);
    }
  }

  async renderCreate(req, res, next) {
    try {
      const activities = await activityService.getAllActivities();
      return res.render('layouts/main', {
        body: '../activity/create',
        title: 'Log New Activity | Work Insight',
        activities,
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
      const activities = await activityService.getAllActivities();
      return res.render('layouts/main', {
        body: '../activity/edit',
        title: 'Edit Activity Log | Work Insight',
        log,
        activities,
        activeMenu: 'activity'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ActivityController();
