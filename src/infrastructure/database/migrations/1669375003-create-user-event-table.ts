
import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('user_event', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable();
    table.string('title')
    table.string('url').unique()
    table.string('start')
    table.string('end')
    table.foreign('user_id').references('user.id')
  });
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_event');
}
