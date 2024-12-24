const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a/development_mbkc',
  port: 5432,
  user: 'development_mbkc_user',
  password: 'VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu',
  database: 'development_mbkc'
});

module.exports = pool;

