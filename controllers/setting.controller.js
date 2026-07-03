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
      const { appName, allowRegistration, maxQuickActions, mophClientKey, mophSecretKey, mophNotifyTime, mophNotifyEnabled } = req.body;
      await settingRepository.updateSettings({
        app_name: appName,
        allow_registration: allowRegistration === 'true' || allowRegistration === true ? 1 : 0,
        max_quick_actions: parseInt(maxQuickActions, 10) || 6,
        moph_client_key: mophClientKey || null,
        moph_secret_key: mophSecretKey || null,
        moph_notify_time: mophNotifyTime || '16:30',
        moph_notify_enabled: mophNotifyEnabled === 'true' || mophNotifyEnabled === true ? 1 : 0
      });
      const reportScheduler = require('../jobs/reportScheduler');
      await reportScheduler.reschedule();

      return res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
  }

  async testMophNotify(req, res, next) {
    try {
      const { mophClientKey, mophSecretKey } = req.body;
      if (!mophClientKey || !mophSecretKey) {
        return res.status(400).json({ success: false, message: 'Please provide both Client Key and Secret Key.' });
      }
      
      const mophNotifyService = require('../services/mophNotify.service');
      const tempSettings = {
        moph_client_key: mophClientKey,
        moph_secret_key: mophSecretKey
      };
      
      await mophNotifyService.sendDailySummary(tempSettings);
      return res.json({ success: true, message: 'Test message triggered. Please check MOPH Notify.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to trigger test message.' });
    }
  }
}

module.exports = new SettingController();
