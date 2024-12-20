const { DataSource } = require('typeorm');
const config = require('../ormconfig');
const User = require('./entities/User');
const Task = require('./entities/Task');

// Initialize the DataSource
const AppDataSource = new DataSource({
    ...config,
    entities: [
        User,
        Task,
    ],
    logging: true
});


module.exports = AppDataSource;