require('dotenv').config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a/development_mbkc',
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: true,
  logging: true, // שיניתי ל-true כדי לראות את ה-queries בזמן פיתוח
  entities: ['src/entities/*.js'],
};