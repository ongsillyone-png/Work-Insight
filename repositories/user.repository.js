const { pool } = require('../config/database');

class UserRepository {
  async findAll() {
    try {
      const rows = await pool.query(
        `SELECT u.*, r.name AS role 
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.deleted_at IS NULL
         ORDER BY u.full_name ASC`
      );
      return rows;
    } catch (err) {
      console.error('Error in UserRepository.findAll:', err);
      throw err;
    }
  }

  async getAllRoles() {
    try {
      const rows = await pool.query('SELECT * FROM roles WHERE is_active = 1 ORDER BY id ASC');
      return rows;
    } catch (err) {
      console.error('Error in UserRepository.getAllRoles:', err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query(
        `SELECT u.*, r.name AS role 
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.deleted_at IS NULL`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error(`Error in UserRepository.findById for ${id}:`, err);
      throw err;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        `INSERT INTO users (username, password_hash, full_name, position, role_id, avatar_url, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.username,
          data.password_hash,
          data.full_name,
          data.position || null,
          data.role_id,
          data.avatar_url || null,
          data.is_active !== undefined ? data.is_active : 1
        ]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.error('Error in UserRepository.create:', err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      let query = `UPDATE users SET username = ?, full_name = ?, position = ?, role_id = ?, avatar_url = ?, is_active = ?`;
      let params = [
          data.username,
          data.full_name,
          data.position || null,
          data.role_id,
          data.avatar_url || null,
          data.is_active !== undefined ? data.is_active : 1
      ];

      if (data.password_hash) {
          query += `, password_hash = ?`;
          params.push(data.password_hash);
      }

      query += ` WHERE id = ?`;
      params.push(id);

      await pool.query(query, params);
      return { id, ...data };
    } catch (err) {
      console.error(`Error in UserRepository.update for ${id}:`, err);
      throw err;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE users SET deleted_at = NOW(), username = CONCAT(username, "_del_", id) WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error(`Error in UserRepository.delete for ${id}:`, err);
      throw err;
    }
  }

  async updatePreferences(id, preferred_categories) {
    try {
      await pool.query('UPDATE users SET preferred_categories = ? WHERE id = ?', [preferred_categories, id]);
      return true;
    } catch (err) {
      console.error(`Error in UserRepository.updatePreferences for ${id}:`, err);
      throw err;
    }
  }

  async updateQuickActions(id, quick_actions) {
    try {
      await pool.query('UPDATE users SET quick_actions = ? WHERE id = ?', [quick_actions, id]);
      return true;
    } catch (err) {
      console.error(`Error in UserRepository.updateQuickActions for ${id}:`, err);
      throw err;
    }
  }

  async updateManagedCategories(id, managed_categories) {
    try {
      await pool.query('UPDATE users SET managed_categories = ? WHERE id = ?', [managed_categories, id]);
      return true;
    } catch (err) {
      console.error(`Error in UserRepository.updateManagedCategories for ${id}:`, err);
      throw err;
    }
  }
}

module.exports = new UserRepository();
