const { Pool } = require('pg');

const pool = new Pool({
  user: 'development_mbkc_user',
  password: 'VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu',
  host: 'dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com',
  database: 'development_mbkc',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// פונקציית בדיקה
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to database');

    // בדיקת מבנה הטבלה
    const tableInfo = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
    console.log('Table columns:', tableInfo.rows);

    // בדיקת נתונים
    const usersQuery = await client.query(`
            SELECT id, email, "fullName"
            FROM users 
            ORDER BY id DESC 
            LIMIT 5
        `);
    console.log('Sample users:', usersQuery.rows);

    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

testConnection();

module.exports = pool;