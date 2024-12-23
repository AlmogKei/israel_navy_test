const { DataSource } = require('typeorm');
const User = require('./entities/User');
const Task = require('./entities/Task');

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com/development_mbkc',
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: true,
    logging: true,
    entities: [User, Task]
});

// הוסף לוגים לחיבור לדאטהבייס
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

module.exports = AppDataSource;