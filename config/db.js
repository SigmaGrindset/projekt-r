const { Pool } = require('pg');

let pool;
if (!process.env.NEON_DB_CONNECTION_STRING) {
  // lokalno sa dockerom
  pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "gsadmin"
  });
} else {

  // neon postgres
  pool = new Pool({
    connectionString: process.env.NEON_DB_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false
    }
  });
}


async function testConnection(req, res) {
  let client;
  let code;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT 1');
    console.log('Database connection successful: ', res.rows);
    code = 200
  } catch (err) {
    console.log('Database connection error:', err);
    code = 500
  }

  finally {
    if (client) client.release();
  }
  return code
}

module.exports = { pool, testConnection };

