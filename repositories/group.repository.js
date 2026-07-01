const { pool } = require('../config/database');

const mockGroups = [];

class GroupRepository {
  async findAll() {
    try {
      const rows = await pool.query(`
        SELECT g.*, c.name as category_name 
        FROM activity_groups g 
        LEFT JOIN activity_categories c ON g.category_id = c.id 
        WHERE g.deleted_at IS NULL 
        ORDER BY g.name ASC
      `);
      return rows;
    } catch (err) {
      console.error(`Database error in group.repository.js:`, err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query('SELECT * FROM activity_groups WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn(`Database offline, finding mock group by id ${id}:`, err.message);
      return mockGroups.find(g => g.id === parseInt(id, 10)) || null;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        'INSERT INTO activity_groups (name, description, category_id, is_active) VALUES (?, ?, ?, ?)',
        [data.name, data.description || null, data.category_id || null, data.is_active !== undefined ? data.is_active : 1]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.warn('Database offline, mock creating activity group:', err.message);
      const newId = mockGroups.length > 0 ? Math.max(...mockGroups.map(g => g.id)) + 1 : 1;
      const newGroup = { id: newId, name: data.name, description: data.description, is_active: 1 };
      mockGroups.push(newGroup);
      return newGroup;
    }
  }

  async update(id, data) {
    try {
      await pool.query(
        'UPDATE activity_groups SET name = ?, description = ?, category_id = ?, is_active = ? WHERE id = ?',
        [data.name, data.description || null, data.category_id || null, data.is_active !== undefined ? data.is_active : 1, id]
      );
      return { id, ...data };
    } catch (err) {
      console.warn(`Database offline, mock updating group ${id}:`, err.message);
      const group = mockGroups.find(g => g.id === parseInt(id, 10));
      if (group) {
        group.name = data.name;
        group.description = data.description;
        group.is_active = data.is_active !== undefined ? data.is_active : group.is_active;
      }
      return group || null;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE activity_groups SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn(`Database offline, mock deleting group ${id}:`, err.message);
      const index = mockGroups.findIndex(g => g.id === parseInt(id, 10));
      if (index !== -1) {
        mockGroups.splice(index, 1);
        return true;
      }
      return false;
    }
  }
}

module.exports = new GroupRepository();
