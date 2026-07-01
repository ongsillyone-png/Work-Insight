const categoryService = require('../services/category.service');
const groupService = require('../services/group.service');

class CategoryController {
  async renderIndex(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      const groups = await groupService.getAllGroups();
      return res.render('layouts/main', {
        body: '../category/index',
        title: 'Activity Categories | Work Insight',
        categories,
        groups,
        activeMenu: 'category'
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Category CRUD ---
  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      await categoryService.createCategory({ name, description });
      return res.redirect('/category');
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      await categoryService.updateCategory(id, { name, description });
      return res.json({ success: true, message: 'หมวดหมู่ถูกอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      return res.json({ success: true, message: 'ลบหมวดหมู่เรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // --- Group CRUD ---
  async createGroup(req, res, next) {
    try {
      const { name, description, category_id } = req.body;
      await groupService.createGroup({ name, description, category_id: category_id ? parseInt(category_id, 10) : null });
      return res.redirect('/category');
    } catch (err) {
      next(err);
    }
  }

  async updateGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, category_id } = req.body;
      await groupService.updateGroup(id, { name, description, category_id: category_id ? parseInt(category_id, 10) : null });
      return res.json({ success: true, message: 'กลุ่มกิจกรรมถูกอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteGroup(req, res, next) {
    try {
      const { id } = req.params;
      await groupService.deleteGroup(id);
      return res.json({ success: true, message: 'ลบกลุ่มกิจกรรมเรียบร้อยแล้ว' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new CategoryController();
