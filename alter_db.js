const mariadb = require('mariadb');
require('dotenv').config();

async function alterTable() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    const result = await conn.query("ALTER TABLE users ADD COLUMN managed_categories VARCHAR(255) DEFAULT NULL AFTER preferred_categories;");
    console.log("Success:", result);
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists, proceeding.");
    } else {
      console.error("Error:", err);
    }
  } finally {
    if (conn) conn.end();
  }
}

alterTable();
