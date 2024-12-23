const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com/development_mbkc',
    ssl: {
        rejectUnauthorized: false
    }
});

// בדיקת חיבור
pool.on('connect', () => {
    console.log('Database pool connected');
});

pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

module.exports = pool;