const categoryService = require('../services/category.service');

class CategoryController {
  async renderIndex(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.render('layouts/main', {
        body: '../category/index',
        title: 'Activity Categories | Work Insight',
        categories,
        activeMenu: 'category'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
