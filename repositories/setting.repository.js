const { pool } = require('../config/database');

class SettingRepository {
  constructor() {
    this.cachedSettings = null;
  }

  async getSettings() {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }
    try {
      const rows = await pool.query('SELECT * FROM system_settings WHERE id = 1');
      const settings = rows[0] || { app_name: 'Work Insight', allow_registration: 0, max_quick_actions: 6 };
      this.cachedSettings = settings;
      return settings;
    } catch (err) {
      console.error('Error fetching settings:', err);
      return { app_name: 'Work Insight', allow_registration: 0, max_quick_actions: 6 };
    }
  }

  async updateSettings(data) {
    try {
      await pool.query(
        'UPDATE system_settings SET app_name = ?, allow_registration = ?, max_quick_actions = ?, moph_client_key = ?, moph_secret_key = ?, moph_notify_time = ?, moph_notify_enabled = ? WHERE id = 1',
        [data.app_name, data.allow_registration, parseInt(data.max_quick_actions, 10), data.moph_client_key, data.moph_secret_key, data.moph_notify_time, data.moph_notify_enabled]
      );
      this.cachedSettings = { 
        id: 1, 
        app_name: data.app_name, 
        allow_registration: data.allow_registration,
        max_quick_actions: parseInt(data.max_quick_actions, 10),
        moph_client_key: data.moph_client_key,
        moph_secret_key: data.moph_secret_key,
        moph_notify_time: data.moph_notify_time,
        moph_notify_enabled: data.moph_notify_enabled
      };
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }
}

module.exports = new SettingRepository();
