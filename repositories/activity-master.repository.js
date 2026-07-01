const { pool } = require('../config/database');

const mockActivityMasters = [];

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
      console.warn(`Database offline, finding mock master activity by id ${id}:`, err.message);
      return mockActivityMasters.find(am => am.id === parseInt(id, 10)) || null;
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
      console.warn('Database offline, mock creating master activity:', err.message);
      const newId = mockActivityMasters.length > 0 ? Math.max(...mockActivityMasters.map(am => am.id)) + 1 : 1;
      const newAm = { 
        id: newId, 
        code: data.code, 
        name: data.name, 
        keyword: data.keyword, 
        default_duration: parseInt(data.default_duration, 10) || 0,
        category_id: parseInt(data.category_id, 10),
        group_id: parseInt(data.group_id, 10),
        is_active: 1,
        categoryName: 'IT', // Mock join names
        groupName: 'Hardware'
      };
      mockActivityMasters.push(newAm);
      return newAm;
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
      console.warn(`Database offline, mock updating master activity ${id}:`, err.message);
      const am = mockActivityMasters.find(am => am.id === parseInt(id, 10));
      if (am) {
        am.code = data.code;
        am.name = data.name;
        am.keyword = data.keyword;
        am.default_duration = parseInt(data.default_duration, 10) || 0;
        am.category_id = parseInt(data.category_id, 10);
        am.group_id = parseInt(data.group_id, 10);
        am.is_active = data.is_active !== undefined ? data.is_active : am.is_active;
      }
      return am || null;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE activity_master SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn(`Database offline, mock deleting master activity ${id}:`, err.message);
      const index = mockActivityMasters.findIndex(am => am.id === parseInt(id, 10));
      if (index !== -1) {
        mockActivityMasters.splice(index, 1);
        return true;
      }
      return false;
    }
  }
}

module.exports = new ActivityMasterRepository();
