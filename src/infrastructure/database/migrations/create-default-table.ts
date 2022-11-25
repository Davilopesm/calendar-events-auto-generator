
import { Knex } from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema.createTable('events', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
  });
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema.dropTable('events');
}
