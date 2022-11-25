
import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('user', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.string('email')
    table.string('name')
  });
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('user');
}
