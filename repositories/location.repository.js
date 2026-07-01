const { pool } = require('../config/database');

// Mock fallback data in case database is offline
const mockLocations = [
  { id: 1, name: 'OPD (แผนกผู้ป่วยนอก)', description: 'ตึกผู้ป่วยนอก ชั้น 1', is_active: 1 },
  { id: 2, name: 'ER (ห้องฉุกเฉิน)', description: 'ตึกอุบัติเหตุและฉุกเฉิน ชั้น 1', is_active: 1 },
  { id: 3, name: 'IPD (แผนกผู้ป่วยใน)', description: 'ตึกผู้ป่วยใน ชั้น 2-5', is_active: 1 },
  { id: 4, name: 'LAB (ห้องปฏิบัติการ)', description: 'ตึกเทคนิคการแพทย์ ชั้น 1', is_active: 1 },
  { id: 5, name: 'ห้องเซิร์ฟเวอร์', description: 'ห้องควบคุมเครือข่าย อาคารสารสนเทศ ชั้น 3', is_active: 1 },
  { id: 6, name: 'ห้องประชุม', description: 'ห้องประชุม IT อาคารสารสนเทศ ชั้น 2', is_active: 1 }
];

class LocationRepository {
  async findAll() {
    try {
      const rows = await pool.query('SELECT * FROM locations WHERE deleted_at IS NULL ORDER BY name ASC');
      return rows;
    } catch (err) {
      console.warn('Database offline, using mock locations:', err.message);
      return mockLocations;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query('SELECT * FROM locations WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn(`Database offline, finding mock location by id ${id}:`, err.message);
      return mockLocations.find(l => l.id === parseInt(id, 10)) || null;
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
      console.warn('Database offline, mock creating location:', err.message);
      const newId = mockLocations.length > 0 ? Math.max(...mockLocations.map(l => l.id)) + 1 : 1;
      const newLoc = { id: newId, name: data.name, description: data.description, is_active: 1 };
      mockLocations.push(newLoc);
      return newLoc;
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
      console.warn(`Database offline, mock updating location ${id}:`, err.message);
      const loc = mockLocations.find(l => l.id === parseInt(id, 10));
      if (loc) {
        loc.name = data.name;
        loc.description = data.description;
        loc.is_active = data.is_active !== undefined ? data.is_active : loc.is_active;
      }
      return loc || null;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE locations SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn(`Database offline, mock deleting location ${id}:`, err.message);
      const index = mockLocations.findIndex(l => l.id === parseInt(id, 10));
      if (index !== -1) {
        mockLocations.splice(index, 1);
        return true;
      }
      return false;
    }
  }
}

module.exports = new LocationRepository();
