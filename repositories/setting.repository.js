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
        'UPDATE system_settings SET app_name = ?, allow_registration = ?, max_quick_actions = ? WHERE id = 1',
        [data.app_name, data.allow_registration, parseInt(data.max_quick_actions, 10)]
      );
      this.cachedSettings = { 
        id: 1, 
        app_name: data.app_name, 
        allow_registration: data.allow_registration,
        max_quick_actions: parseInt(data.max_quick_actions, 10)
      };
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }
}

module.exports = new SettingRepository();
