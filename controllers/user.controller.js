const userService = require('../services/user.service');

class UserController {
  async renderIndex(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      const roles = await userService.getAllRoles();
      return res.render('layouts/main', {
        body: '../user/index',
        title: 'Users Management | Work Insight',
        users,
        roles,
        activeMenu: 'user'
      });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      if (!req.body.password) {
        return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสผ่าน' });
      }

      const data = {
        full_name: req.body.full_name,
        username: req.body.username,
        position: req.body.position,
        role_id: req.body.role_id,
        password: req.body.password
      };
      await userService.createUser(data);
      return res.json({ success: true, message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to create user' });
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const data = {
        full_name: req.body.full_name,
        username: req.body.username,
        position: req.body.position,
        role_id: req.body.role_id,
        is_active: req.body.is_active
      };
      if (req.body.password) {
        data.password = req.body.password;
      }
      await userService.updateUser(id, data);
      return res.json({ success: true, message: 'User updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      return res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const userId = req.user.id;
      // Expecting preferred_categories to be a string like "1,3,4" or empty string
      const { preferred_categories } = req.body; 
      await userService.updatePreferences(userId, preferred_categories);
      return res.json({ success: true, message: 'บันทึกการตั้งค่าส่วนตัวเรียบร้อยแล้ว' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'ไม่สามารถบันทึกการตั้งค่าส่วนตัวได้' });
    }
  }

  async updateQuickActions(req, res, next) {
    try {
      const userId = req.user.id;
      const { quick_actions } = req.body; 
      await userService.updateQuickActions(userId, quick_actions);
      return res.json({ success: true, message: 'บันทึก Quick Actions เรียบร้อยแล้ว' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'ไม่สามารถบันทึก Quick Actions ได้' });
    }
  }
}

module.exports = new UserController();
