const { Pool } = require('pg');

// הגדרות החיבור
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

// פונקציית בדיקת חיבור
const testConnection = async () => {
  let client;
  try {
    // בדיקת חיבור
    client = await pool.connect();
    console.log('Successfully connected to database');

    // בדיקת טבלת משתמשים
    const { rows } = await client.query(`
            SELECT id, email, fullname 
            FROM users 
            ORDER BY id DESC 
            LIMIT 5
        `);

    console.log('Found users:', rows);
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

// בדיקת חיבור בהתחלה
testConnection()
  .then(success => {
    if (!success) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
  });

module.exports = pool;