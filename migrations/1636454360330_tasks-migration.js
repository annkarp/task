const {PgLiteral} = require("node-pg-migrate");

exports.up = pgm => {
  pgm.createTable('users', {
    public_id: { type: 'uuid', notNull: true },
    username: { type: 'string', notNull: true },
    role: { type: 'string', notNull: true },
  })
  pgm.createTable('tasks', {
    id: {
      type: 'serial',
      notNull: true,
      primaryKey: true
    },
    public_id: {
      type: 'uuid',
      default: new PgLiteral('uuid_generate_v4()'),
      notNull: true,
    },
    description: { type: 'string', notNull: true },
    status: { type: 'string', notNull: true },
    account_id: { type: 'uuid', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
};

exports.down = pgm => {};
