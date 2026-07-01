const { pool } = require('../config/database');

// Mock fallback logs
const mockLogs = [
  { id: 1, user_id: 1, activityMasterId: 1, activityName: 'ซ่อมและแก้ไขอุปกรณ์คอมพิวเตอร์ (Hardware Repair)', logDate: '2026-06-30', date: '2026-06-30', session: 'Morning', duration: 30, locationId: 5, location: 'ห้องเซิร์ฟเวอร์', output: 'แก้ไข HOSxP ช้า', remark: 'เปิดแอร์เครื่องสำรอง' },
  { id: 2, user_id: 1, activityMasterId: 7, activityName: 'ติดตั้งเครื่องพิมพ์สำหรับจุดคัดกรอง OPD (Printer setup)', logDate: '2026-06-30', date: '2026-06-30', session: 'Afternoon', duration: 15, locationId: 1, location: 'OPD (แผนกผู้ป่วยนอก)', output: 'แก้ไขคิว Printer', remark: 'เปลี่ยนสาย USB' },
  { id: 3, user_id: 1, activityMasterId: 2, activityName: 'ตรวจสอบการสำรองข้อมูล MariaDB (Database Backup)', logDate: '2026-06-29', date: '2026-06-29', session: 'Afternoon', duration: 60, locationId: 5, location: 'ห้องเซิร์ฟเวอร์', output: 'ตรวจสอบ MariaDB Backup เรียบร้อย', remark: 'ขนาดไฟล์ 45GB' }
];

// Mock fallback favorites
const mockFavorites = [
  { id: 1, name: 'ซ่อมและแก้ไขอุปกรณ์คอมพิวเตอร์ (Hardware Repair)', code: 'ACT-001', activity_master_id: 1 },
  { id: 2, name: 'ตรวจสอบการสำรองข้อมูล MariaDB (Database Backup)', code: 'ACT-002', activity_master_id: 2 },
  { id: 3, name: 'ตรวจสอบอุณหภูมิห้องเซิร์ฟเวอร์ (Server Monitoring)', code: 'ACT-003', activity_master_id: 3 }
];

class ActivityRepository {
  async findAll() {
    try {
      const rows = await pool.query('SELECT * FROM activity_logs WHERE deleted_at IS NULL');
      return rows;
    } catch (err) {
      console.warn('Database offline, using mock logs for findAll:', err.message);
      return mockLogs;
    }
  }

  async findById(id) {
    try {
      const rows = await pool.query(`
        SELECT 
          al.id,
          al.user_id,
          al.activity_master_id AS activityMasterId,
          DATE_FORMAT(al.log_date, '%Y-%m-%d') as logDate,
          DATE_FORMAT(al.log_date, '%Y-%m-%d') as date,
          al.session,
          al.duration,
          al.location_id AS locationId,
          al.output,
          al.remark,
          am.name AS activityName
        FROM activity_logs al
        JOIN activity_master am ON al.activity_master_id = am.id
        WHERE al.id = ? AND al.deleted_at IS NULL
      `, [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn(`Database offline, finding mock log by id ${id}:`, err.message);
      return mockLogs.find(l => l.id === parseInt(id, 10)) || null;
    }
  }

  async create(data) {
    try {
      const result = await pool.query(
        `INSERT INTO activity_logs (user_id, activity_master_id, log_date, session, duration, location_id, output, remark) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.user_id || 1,
          data.activityMasterId,
          data.logDate || new Date().toISOString().split('T')[0],
          data.session,
          parseInt(data.duration, 10),
          data.locationId ? parseInt(data.locationId, 10) : null,
          data.output || null,
          data.remark || null
        ]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.warn('Database offline, mock creating log:', err.message);
      const newId = mockLogs.length > 0 ? Math.max(...mockLogs.map(l => l.id)) + 1 : 1;
      const newLog = { 
        id: newId, 
        user_id: data.user_id || 1, 
        activityMasterId: parseInt(data.activityMasterId, 10), 
        activityName: 'กิจกรรมบันทึกใหม่', // Placeholder
        logDate: data.logDate || new Date().toISOString().split('T')[0],
        date: data.logDate || new Date().toISOString().split('T')[0],
        session: data.session,
        duration: parseInt(data.duration, 10),
        locationId: data.locationId ? parseInt(data.locationId, 10) : null,
        location: 'สถานที่ระบุ',
        output: data.output,
        remark: data.remark
      };
      mockLogs.push(newLog);
      return newLog;
    }
  }

  async update(id, data) {
    try {
      await pool.query(
        `UPDATE activity_logs 
         SET activity_master_id = ?, log_date = ?, session = ?, duration = ?, location_id = ?, output = ?, remark = ? 
         WHERE id = ?`,
        [
          data.activityMasterId,
          data.logDate,
          data.session,
          parseInt(data.duration, 10),
          data.locationId ? parseInt(data.locationId, 10) : null,
          data.output || null,
          data.remark || null,
          id
        ]
      );
      return { id, ...data };
    } catch (err) {
      console.warn(`Database offline, mock updating log ${id}:`, err.message);
      const log = mockLogs.find(l => l.id === parseInt(id, 10));
      if (log) {
        log.activityMasterId = parseInt(data.activityMasterId, 10);
        log.logDate = data.logDate;
        log.date = data.logDate;
        log.session = data.session;
        log.duration = parseInt(data.duration, 10);
        log.locationId = data.locationId ? parseInt(data.locationId, 10) : null;
        log.output = data.output;
        log.remark = data.remark;
      }
      return log || null;
    }
  }

  async delete(id) {
    try {
      await pool.query('UPDATE activity_logs SET deleted_at = NOW() WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn(`Database offline, mock deleting log ${id}:`, err.message);
      const index = mockLogs.findIndex(l => l.id === parseInt(id, 10));
      if (index !== -1) {
        mockLogs.splice(index, 1);
        return true;
      }
      return false;
    }
  }

  async findFavoritesByUser(userId) {
    try {
      const rows = await pool.query(`
        SELECT 
          fa.id,
          fa.activity_master_id,
          am.name,
          am.code
        FROM favorite_activity fa
        JOIN activity_master am ON fa.activity_master_id = am.id
        WHERE fa.user_id = ? AND fa.deleted_at IS NULL
      `, [userId]);
      return rows;
    } catch (err) {
      console.warn(`Database offline, using mock favorites for user ${userId}:`, err.message);
      return mockFavorites;
    }
  }

  async findLogsByUser(userId) {
    try {
      const rows = await pool.query(`
        SELECT 
          al.id,
          al.user_id,
          al.activity_master_id AS activityMasterId,
          DATE_FORMAT(al.log_date, '%Y-%m-%d') as date,
          DATE_FORMAT(al.log_date, '%Y-%m-%d') as logDate,
          al.session,
          al.duration,
          al.location_id AS locationId,
          l.name AS location,
          al.output,
          al.remark,
          am.name AS activityName
        FROM activity_logs al
        JOIN activity_master am ON al.activity_master_id = am.id
        LEFT JOIN locations l ON al.location_id = l.id
        WHERE al.user_id = ? AND al.deleted_at IS NULL
        ORDER BY al.log_date DESC, al.created_at DESC
      `, [userId]);
      return rows;
    } catch (err) {
      console.warn(`Database offline, using mock logs for user ${userId}:`, err.message);
      return mockLogs.filter(log => log.user_id === parseInt(userId, 10));
    }
  }
}

module.exports = new ActivityRepository();
