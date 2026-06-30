class SettingController {
  async renderIndex(req, res, next) {
    try {
      return res.render('layouts/main', {
        body: '../setting/index',
        title: 'System Settings | Work Insight',
        activeMenu: 'setting'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SettingController();
