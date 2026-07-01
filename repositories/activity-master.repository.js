const { pool } = require('../config/database');

// Mock fallback data in case database is offline
const mockActivityMasters = [
  { id: 1, code: 'ACT-001', name: 'ซ่อมและแก้ไขอุปกรณ์คอมพิวเตอร์ (Hardware Repair)', keyword: 'ซ่อมคอม, เม้าส์, คีย์บอร์ด, จอภาพ', default_duration: 30, category_id: 1, group_id: 1, is_active: 1, categoryName: 'IT', groupName: 'Hardware' },
  { id: 2, code: 'ACT-002', name: 'ตรวจสอบการสำรองข้อมูล MariaDB (Database Backup)', keyword: 'backup, database, สำรองข้อมูล, sql', default_duration: 30, category_id: 1, group_id: 3, is_active: 1, categoryName: 'IT', groupName: 'Database' },
  { id: 3, code: 'ACT-003', name: 'ตรวจสอบอุณหภูมิห้องเซิร์ฟเวอร์ (Server Monitoring)', keyword: 'server, temp, monitor, อุณหภูมิ', default_duration: 15, category_id: 1, group_id: 4, is_active: 1, categoryName: 'IT', groupName: 'Server' },
  { id: 4, code: 'ACT-004', name: 'วิเคราะห์และตั้งค่าเครือข่าย (Network Setup)', keyword: 'network, switch, router, ip, wifi', default_duration: 60, category_id: 1, group_id: 5, is_active: 1, categoryName: 'IT', groupName: 'Network' },
  { id: 5, code: 'ACT-005', name: 'ออกแบบแบนเนอร์ประชาสัมพันธ์โรงพยาบาล (PR Graphic Design)', keyword: 'graphic, photoshop, banner, ออกแบบ, รูปภาพ', default_duration: 120, category_id: 3, group_id: 6, is_active: 1, categoryName: 'ประชาสัมพันธ์', groupName: 'Graphic' },
  { id: 6, code: 'ACT-006', name: 'ประชุมวางแผนเทคโนโลยีสารสนเทศกลุ่มงานดิจิทัล (Meeting)', keyword: 'meeting, ประชุม, แผนงาน', default_duration: 60, category_id: 4, group_id: 7, is_active: 1, categoryName: 'ประชุม', groupName: 'HAIT' },
  { id: 7, code: 'ACT-007', name: 'ติดตั้งเครื่องพิมพ์สำหรับจุดคัดกรอง OPD (Printer setup)', keyword: 'printer, setup, install, พรินเตอร์, เครื่องพิมพ์', default_duration: 45, category_id: 1, group_id: 1, is_active: 1, categoryName: 'IT', groupName: 'Hardware' },
  { id: 8, code: 'ACT-008', name: 'จัดทำเอกสารคู่มือการใช้งานระบบ HOSxP (Documentation)', keyword: 'doc, manual, คู่มือ, เอกสาร', default_duration: 90, category_id: 6, group_id: 8, is_active: 1, categoryName: 'เอกสาร', groupName: 'KPI' }
];

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
      console.warn('Database offline, using mock master activities:', err.message);
      return mockActivityMasters;
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
