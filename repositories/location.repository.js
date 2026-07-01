const { pool } = require('../config/database');


class LocationRepository {
  async findAll() {
    try {
      const rows = await pool.query('SELECT * FROM locations WHERE deleted_at IS NULL ORDER BY name ASC');
      return rows;
    } catch (err) {
      console.error(`Database error in location.repository.js:`, err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query('SELECT * FROM locations WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows[0] || null;
    } catch (err) {
      console.error(`Database error in location.repository.js:`, err);
      throw err;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        'INSERT INTO locations (name, description, is_active) VALUES (?, ?, ?)',
        [data.name, data.description || null, data.is_active !== undefined ? data.is_active : 1]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.error(`Database error in location.repository.js:`, err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      await pool.query(
        'UPDATE locations SET name = ?, description = ?, is_active = ? WHERE id = ?',
        [data.name, data.description || null, data.is_active !== undefined ? data.is_active : 1, id]
      );
      return { id, ...data };
    } catch (err) {
      console.error(`Database error in location.repository.js:`, err);
      throw err;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE locations SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error(`Database error in location.repository.js:`, err);
      throw err;
    }
  }
}

module.exports = new LocationRepository();
