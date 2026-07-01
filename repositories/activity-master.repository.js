const { pool } = require('../config/database');


class ActivityMasterRepository {
  async findAll() {
    try {
      const rows = await pool.query(`
        SELECT 
          am.*, 
          ac.name AS categoryName, 
          ag.name AS groupName 
        FROM activity_master am
        JOIN activity_categories ac ON am.category_id = ac.id
        JOIN activity_groups ag ON am.group_id = ag.id
        WHERE am.deleted_at IS NULL
        ORDER BY am.code ASC
      `);
      return rows;
    } catch (err) {
      console.error(`Database error in activity-master.repository.js:`, err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query(`
        SELECT 
          am.*, 
          ac.name AS categoryName, 
          ag.name AS groupName 
        FROM activity_master am
        JOIN activity_categories ac ON am.category_id = ac.id
        JOIN activity_groups ag ON am.group_id = ag.id
        WHERE am.id = ? AND am.deleted_at IS NULL
      `, [id]);
      return rows[0] || null;
    } catch (err) {
      console.error(`Database error in activity-master.repository.js:`, err);
      throw err;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        `INSERT INTO activity_master (code, name, keyword, default_duration, category_id, group_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.code,
          data.name,
          data.keyword || null,
          data.default_duration !== undefined ? parseInt(data.default_duration, 10) : 0,
          data.category_id,
          data.group_id,
          data.is_active !== undefined ? data.is_active : 1
        ]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.error(`Database error in activity-master.repository.js:`, err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      await pool.query(
        `UPDATE activity_master 
         SET code = ?, name = ?, keyword = ?, default_duration = ?, category_id = ?, group_id = ?, is_active = ? 
         WHERE id = ?`,
        [
          data.code,
          data.name,
          data.keyword || null,
          data.default_duration !== undefined ? parseInt(data.default_duration, 10) : 0,
          data.category_id,
          data.group_id,
          data.is_active !== undefined ? data.is_active : 1,
          id
        ]
      );
      return { id, ...data };
    } catch (err) {
      console.error(`Database error in activity-master.repository.js:`, err);
      throw err;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE activity_master SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error(`Database error in activity-master.repository.js:`, err);
      throw err;
    }
  }
}

module.exports = new ActivityMasterRepository();
