const { pool } = require('../config/database');

class AuthRepository {
  /**
   * Find a user by username
   * @param {string} username 
   */
  async findByUsername(username) {
    try {
      const rows = await pool.query(
        `SELECT u.*, r.name AS role 
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.username = ? AND u.is_active = 1`,
        [username]
      );
      return rows[0] || null;
    } catch (err) {
      console.error('Error finding user by username:', err);
      throw err;
    }
  }
}

module.exports = new AuthRepository();
