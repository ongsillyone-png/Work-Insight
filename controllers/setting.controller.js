const settingRepository = require('../repositories/setting.repository');

class SettingController {
  async renderIndex(req, res, next) {
    try {
      const settings = await settingRepository.getSettings();
      return res.render('layouts/main', {
        body: '../setting/index',
        title: 'System Settings | Work Insight',
        activeMenu: 'setting',
        settings
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const { appName, allowRegistration } = req.body;
      await settingRepository.updateSettings({
        app_name: appName,
        allow_registration: allowRegistration === 'true' || allowRegistration === true ? 1 : 0
      });
      return res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
  }
}

module.exports = new SettingController();
