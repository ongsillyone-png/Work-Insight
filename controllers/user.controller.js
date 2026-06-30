const userService = require('../services/user.service');

class UserController {
  async renderIndex(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.render('layouts/main', {
        body: '../user/index',
        title: 'Users Management | Work Insight',
        users,
        activeMenu: 'user'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
