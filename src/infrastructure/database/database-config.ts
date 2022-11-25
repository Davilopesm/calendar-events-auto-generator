
import { Knex } from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const dbConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  migrations: {
    directory: 'migrations'
  }
}

export default dbConfig;
