const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'work_insight',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 5,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
});

module.exports = {
  pool,
  // Helper to get connection from pool
  getConnection: async () => {
    try {
      const conn = await pool.getConnection();
      return conn;
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
};
