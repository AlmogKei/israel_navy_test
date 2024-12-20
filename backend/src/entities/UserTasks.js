const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'UserTask',
    tableName: 'users_tasks',
    columns: {
        assigned_at: {
            type: 'timestamp',
            createDate: true,
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'user_id' },
            onDelete: 'CASCADE',
            nullable: false,
        },
        task: {
            type: 'many-to-one',
            target: 'Task',
            joinColumn: { name: 'task_id' },
            onDelete: 'CASCADE',
            nullable: false,
        },
    },
    indices: [
        {
            name: 'IDX_USER_TASK',
            columns: ['user_id', 'task_id'],
            unique: true,
        },
    ],
});
