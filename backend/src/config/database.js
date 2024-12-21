const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a/development_mbkc',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;