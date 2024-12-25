require('dotenv').config();


module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a/development_mbkc',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'development_mbkc_user',
  password: process.env.DB_PASSWORD || 'VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu',
  database: process.env.DB_NAME || 'development_mbkc',
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.js'],
};
