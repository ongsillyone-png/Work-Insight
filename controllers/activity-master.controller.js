const activityMasterService = require('../services/activity-master.service');
const categoryService = require('../services/category.service');
const groupService = require('../services/group.service');

class ActivityMasterController {
  async renderIndex(req, res, next) {
    try {
      const activities = await activityMasterService.getAllActivities();
      const categories = await categoryService.getAllCategories();
      const groups = await groupService.getAllGroups();
      
      return res.render('layouts/main', {
        body: '../activity-master/index',
        title: 'Manage Activities | Work Insight',
        activities,
        categories,
        groups,
        activeMenu: 'activity_master'
      });
    } catch (err) {
      next(err);
    }
  }

  async createActivity(req, res, next) {
    try {
      const { code, name, keyword, default_duration, category_id, group_id, is_active } = req.body;
      await activityMasterService.createActivity({
        code,
        name,
        keyword,
        default_duration: default_duration !== undefined ? parseInt(default_duration, 10) : 0,
        category_id: parseInt(category_id, 10),
        group_id: parseInt(group_id, 10),
        is_active: is_active !== undefined ? parseInt(is_active, 10) : 1
      });
      return res.redirect('/activity-master');
    } catch (err) {
      next(err);
    }
  }

  async updateActivity(req, res, next) {
    try {
      const { id } = req.params;
      const { code, name, keyword, default_duration, category_id, group_id, is_active } = req.body;
      await activityMasterService.updateActivity(id, {
        code,
        name,
        keyword,
        default_duration: default_duration !== undefined ? parseInt(default_duration, 10) : 0,
        category_id: parseInt(category_id, 10),
        group_id: parseInt(group_id, 10),
        is_active: is_active !== undefined ? parseInt(is_active, 10) : 1
      });
      return res.json({ success: true, message: 'กิจกรรมหลักถูกอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteActivity(req, res, next) {
    try {
      const { id } = req.params;
      await activityMasterService.deleteActivity(id);
      return res.json({ success: true, message: 'ลบกิจกรรมหลักเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ActivityMasterController();
