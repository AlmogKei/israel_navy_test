const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
      generationStrategy: 'increment',
    },
    fullName: {
      type: 'varchar',
      length: 100,
      nullable: false,
      default: 'Unknown',
    },
    email: {
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false,
    },
    phone: {
      type: 'varchar',
      length: 15,
      nullable: false,
      default: 'N/A',
    },
    password_hash: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});