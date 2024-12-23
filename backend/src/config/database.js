const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com/development_mbkc',
  ssl: {
    rejectUnauthorized: false
  }
});

// נוסיף פונקציית בדיקה שרצה מיד
const checkConnection = async () => {
  try {
    // בדיקת חיבור בסיסית
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');

    // בדיקת הטבלה
    const userCheck = await client.query('SELECT id, email FROM users LIMIT 5');
    console.log('Users in database:', userCheck.rows);

    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

// הרצת הבדיקה
checkConnection();

module.exports = pool;