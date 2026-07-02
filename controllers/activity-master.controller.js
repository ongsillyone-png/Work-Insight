const activityMasterService = require('../services/activity-master.service');
const categoryService = require('../services/category.service');
const groupService = require('../services/group.service');

class ActivityMasterController {
  async renderIndex(req, res, next) {
    try {
      let activities = await activityMasterService.getAllActivities();
      let categories = await categoryService.getAllCategories();
      let groups = await groupService.getAllGroups();
      
      if (req.user && req.user.role_id !== 1) { // Not Admin
        if (req.user.managed_categories) {
          const managedIds = req.user.managed_categories.split(',').map(id => id.trim());
          categories = categories.filter(c => managedIds.includes(c.id.toString()));
          groups = groups.filter(g => g.category_id && managedIds.includes(g.category_id.toString()));
          activities = activities.filter(a => a.category_id && managedIds.includes(a.category_id.toString()));
        } else {
          categories = [];
          groups = [];
          activities = [];
        }
      }
      
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
