const { pool } = require('../config/database');

class SettingRepository {
  async getSettings() {
    try {
      const rows = await pool.query('SELECT * FROM system_settings WHERE id = 1');
      return rows[0] || { app_name: 'Work Insight', allow_registration: 0 };
    } catch (err) {
      console.error('Error fetching settings:', err);
      return { app_name: 'Work Insight', allow_registration: 0 };
    }
  }

  async updateSettings(data) {
    try {
      await pool.query(
        'UPDATE system_settings SET app_name = ?, allow_registration = ? WHERE id = 1',
        [data.app_name, data.allow_registration]
      );
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }
}

module.exports = new SettingRepository();
