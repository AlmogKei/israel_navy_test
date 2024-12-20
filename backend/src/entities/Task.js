const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
      generationStrategy: 'increment',
    },
    task_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    task_value: {
      type: 'int',
      nullable: false,
    },
    user_id: {
      type: 'int',
      nullable: false,
    },
    created_at: {
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
    },
  },
});