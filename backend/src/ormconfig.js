require('dotenv').config();


module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'development_mbkc_user',
  password: process.env.DB_PASSWORD || 'VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu',
  database: process.env.DB_NAME || 'development_mbkc',
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.js'],
};
