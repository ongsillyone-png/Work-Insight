const { pool } = require('../config/database');

const mockCategories = [];

class CategoryRepository {
  async findAll() {
    try {
      const rows = await pool.query('SELECT * FROM activity_categories WHERE deleted_at IS NULL ORDER BY name ASC');
      return rows;
    } catch (err) {
      console.error(`Database error in category.repository.js:`, err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query('SELECT * FROM activity_categories WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn(`Database offline, finding mock category by id ${id}:`, err.message);
      return mockCategories.find(c => c.id === parseInt(id, 10)) || null;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        'INSERT INTO activity_categories (name, description, is_active) VALUES (?, ?, ?)',
        [data.name, data.description || null, data.is_active !== undefined ? data.is_active : 1]
      );
      // mariadb package returns insertId in the result metadata
      return { id: result.insertId, ...data };
    } catch (err) {
      console.warn('Database offline, mock creating category:', err.message);
      const newId = mockCategories.length > 0 ? Math.max(...mockCategories.map(c => c.id)) + 1 : 1;
      const newCategory = { id: newId, name: data.name, description: data.description, is_active: 1 };
      mockCategories.push(newCategory);
      return newCategory;
    }
  }

  async update(id, data) {
    try {
      await pool.query(
        'UPDATE activity_categories SET name = ?, description = ?, is_active = ? WHERE id = ?',
        [data.name, data.description || null, data.is_active !== undefined ? data.is_active : 1, id]
      );
      return { id, ...data };
    } catch (err) {
      console.warn(`Database offline, mock updating category ${id}:`, err.message);
      const category = mockCategories.find(c => c.id === parseInt(id, 10));
      if (category) {
        category.name = data.name;
        category.description = data.description;
        category.is_active = data.is_active !== undefined ? data.is_active : category.is_active;
      }
      return category || null;
    }
  }

  async delete(id) {
    try {
      // Soft delete
      await pool.query('UPDATE activity_categories SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn(`Database offline, mock deleting category ${id}:`, err.message);
      const index = mockCategories.findIndex(c => c.id === parseInt(id, 10));
      if (index !== -1) {
        mockCategories.splice(index, 1);
        return true;
      }
      return false;
    }
  }
}

module.exports = new CategoryRepository();
