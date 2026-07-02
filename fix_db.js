const mariadb = require('mariadb');
require('dotenv').config();
mariadb.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).then(conn => {
  conn.query('UPDATE users SET username = CONCAT(username, "_del_", id) WHERE deleted_at IS NOT NULL AND username NOT LIKE "%_del_%"')
    .then(res => {
      console.log('Fixed soft-deleted users:', res.affectedRows);
      conn.end();
    })
    .catch(err => {
      console.error(err);
      conn.end();
    });
});
