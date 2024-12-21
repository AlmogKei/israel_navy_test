require('dotenv').config();


module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'development',
  synchronize: true,
  logging: true,
  entities: ['src/entities/*.js'],
};
