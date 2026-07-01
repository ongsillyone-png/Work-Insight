const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Starting Database Seeding...');
  let conn;
  try {
    conn = await pool.getConnection();

    // 1. Seed Roles
    const rolesCheck = await conn.query('SELECT COUNT(*) as count FROM roles');
    if (Number(rolesCheck[0].count) === 0) {
      console.log('Seeding roles...');
      await conn.query(`
        INSERT INTO roles (id, name, description, is_active) VALUES
        (1, 'Admin', 'System Administrator with full access', 1),
        (2, 'User', 'Standard Staff member logging activities', 1)
      `);
      console.log('Roles seeded successfully!');
    } else {
      console.log('Roles table already has data, skipping.');
    }

    // 2. Seed Users
    const usersCheck = await conn.query('SELECT COUNT(*) as count FROM users');
    if (Number(usersCheck[0].count) === 0) {
      console.log('Seeding default administrator...');
      const passwordHash = bcrypt.hashSync('admin', 10);
      await conn.query(`
        INSERT INTO users (id, username, password_hash, full_name, position, role_id, is_active) VALUES
        (1, 'admin', ?, 'Mock Admin User', 'IT Administrator', 1, 1)
      `, [passwordHash]);
      console.log('Default admin user seeded successfully! (Username: admin / Password: admin)');
    } else {
      console.log('Users table already has data, skipping.');
    }

    // 3. Seed Activity Categories
    const categoriesCheck = await conn.query('SELECT COUNT(*) as count FROM activity_categories');
    if (Number(categoriesCheck[0].count) === 0) {
      console.log('Seeding activity categories...');
      await conn.query(`
        INSERT INTO activity_categories (id, name, description, is_active) VALUES
        (1, 'IT', 'งานเทคโนโลยีสารสนเทศและดิจิทัล', 1),
        (2, 'แผนงาน', 'งานนโยบายและแผนงาน', 1),
        (3, 'ประชาสัมพันธ์', 'งานสื่อสารองค์กรและประชาสัมพันธ์', 1),
        (4, 'ประชุม', 'การประชุมและสัมมนาวิชาการ', 1),
        (5, 'บริหาร', 'งานบริหารทั่วไปและทรัพยากรบุคคล', 1),
        (6, 'เอกสาร', 'งานสารบรรณและงานเอกสาร', 1)
      `);
      console.log('Activity categories seeded successfully!');
    } else {
      console.log('Activity categories already have data, skipping.');
    }

    // 4. Seed Activity Groups
    const groupsCheck = await conn.query('SELECT COUNT(*) as count FROM activity_groups');
    if (Number(groupsCheck[0].count) === 0) {
      console.log('Seeding activity groups...');
      await conn.query(`
        INSERT INTO activity_groups (id, name, description, is_active) VALUES
        (1, 'Hardware', 'อุปกรณ์และฮาร์ดแวร์คอมพิวเตอร์', 1),
        (2, 'Software', 'โปรแกรมและแอปพลิเคชันระบบ', 1),
        (3, 'Database', 'ระบบฐานข้อมูลดิจิทัล', 1),
        (4, 'Server', 'เครื่องแม่ข่ายและการบำรุงรักษา', 1),
        (5, 'Network', 'ระบบเครือข่ายความเร็วสูง', 1),
        (6, 'Graphic', 'งานออกแบบและสื่อสารภาพลักษณ์', 1),
        (7, 'HAIT', 'มาตรฐานเทคโนโลยีสารสนเทศโรงพยาบาล', 1),
        (8, 'KPI', 'ตัวชี้วัดและสถิติประเมินผลการทำงาน', 1)
      `);
      console.log('Activity groups seeded successfully!');
    } else {
      console.log('Activity groups already have data, skipping.');
    }

    // 5. Seed Locations
    const locationsCheck = await conn.query('SELECT COUNT(*) as count FROM locations');
    if (Number(locationsCheck[0].count) === 0) {
      console.log('Seeding locations...');
      await conn.query(`
        INSERT INTO locations (id, name, description, is_active) VALUES
        (1, 'OPD (แผนกผู้ป่วยนอก)', 'ตึกผู้ป่วยนอก ชั้น 1', 1),
        (2, 'ER (ห้องฉุกเฉิน)', 'ตึกอุบัติเหตุและฉุกเฉิน ชั้น 1', 1),
        (3, 'IPD (แผนกผู้ป่วยใน)', 'ตึกผู้ป่วยใน ชั้น 2-5', 1),
        (4, 'LAB (ห้องปฏิบัติการ)', 'ตึกเทคนิคการแพทย์ ชั้น 1', 1),
        (5, 'ห้องเซิร์ฟเวอร์', 'ห้องควบคุมเครือข่าย อาคารสารสนเทศ ชั้น 3', 1),
        (6, 'ห้องประชุม', 'ห้องประชุม IT อาคารสารสนเทศ ชั้น 2', 1)
      `);
      console.log('Locations seeded successfully!');
    } else {
      console.log('Locations already have data, skipping.');
    }

    // 6. Seed Activity Master
    const masterCheck = await conn.query('SELECT COUNT(*) as count FROM activity_master');
    if (Number(masterCheck[0].count) === 0) {
      console.log('Seeding activity master definitions...');
      await conn.query(`
        INSERT INTO activity_master (id, code, name, keyword, default_duration, category_id, group_id, is_active) VALUES
        (1, 'ACT-001', 'ซ่อมและแก้ไขอุปกรณ์คอมพิวเตอร์ (Hardware Repair)', 'ซ่อมคอม, เม้าส์, คีย์บอร์ด, จอภาพ', 30, 1, 1, 1),
        (2, 'ACT-002', 'ตรวจสอบการสำรองข้อมูล MariaDB (Database Backup)', 'backup, database, สำรองข้อมูล, sql', 30, 1, 3, 1),
        (3, 'ACT-003', 'ตรวจสอบอุณหภูมิห้องเซิร์ฟเวอร์ (Server Monitoring)', 'server, temp, monitor, อุณหภูมิ', 15, 1, 4, 1),
        (4, 'ACT-004', 'วิเคราะห์และตั้งค่าเครือข่าย (Network Setup)', 'network, switch, router, ip, wifi', 60, 1, 5, 1),
        (5, 'ACT-005', 'ออกแบบแบนเนอร์ประชาสัมพันธ์โรงพยาบาล (PR Graphic Design)', 'graphic, photoshop, banner, ออกแบบ, รูปภาพ', 120, 3, 6, 1),
        (6, 'ACT-006', 'ประชุมวางแผนเทคโนโลยีสารสนเทศกลุ่มงานดิจิทัล (Meeting)', 'meeting, ประชุม, แผนงาน', 60, 4, 7, 1),
        (7, 'ACT-007', 'ติดตั้งเครื่องพิมพ์สำหรับจุดคัดกรอง OPD (Printer setup)', 'printer, setup, install, พรินเตอร์, เครื่องพิมพ์', 45, 1, 1, 1),
        (8, 'ACT-008', 'จัดทำเอกสารคู่มือการใช้งานระบบ HOSxP (Documentation)', 'doc, manual, คู่มือ, เอกสาร', 90, 6, 8, 1)
      `);
      console.log('Activity master definitions seeded successfully!');
    } else {
      console.log('Activity master definitions already have data, skipping.');
    }

    console.log('Database Seeding Completed Successfully!');
  } catch (err) {
    console.error('Database Seeding Failed:', err);
    throw err;
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

seed();
