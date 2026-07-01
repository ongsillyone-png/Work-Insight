const { pool } = require('../config/database');

async function createSettingsTable() {
  try {
    console.log('Creating system_settings table...');
    const query = `
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        app_name VARCHAR(100) NOT NULL DEFAULT 'Work Insight',
        allow_registration TINYINT(1) NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(query);
    
    console.log('Inserting default settings...');
    await pool.query(`INSERT INTO system_settings (id, app_name, allow_registration) VALUES (1, 'Work Insight', 0) ON DUPLICATE KEY UPDATE id=1;`);
    
    console.log('Settings table created successfully!');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit();
  }
}

createSettingsTable();
