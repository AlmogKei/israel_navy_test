const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com/development_mbkc',
  ssl: {
    rejectUnauthorized: false
  }
});

// פונקציית בדיקת חיבור
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');

    // בדיקת מבנה הטבלה
    const tableInfo = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
    console.log('Table structure:', tableInfo.rows);

    // בדיקת כל המשתמשים
    const allUsers = await client.query('SELECT * FROM users');
    console.log('All users count:', allUsers.rows.length);
    console.log('First few users:', allUsers.rows.slice(0, 3));

    // בדיקת משתמש ספציפי
    const testUser = await client.query('SELECT * FROM users WHERE email = $1', ['almog55@gmail.com']);
    console.log('Test user query result:', testUser.rows);

    client.release();
  } catch (err) {
    console.error('Database test error:', err);
    if (err.code === 'ECONNREFUSED') {
      console.error('Failed to connect to database. Please check connection details.');
    }
  }
};

// הרצת בדיקת החיבור
testConnection();

// טיפול באירועי pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;