
import { Knex } from 'knex'

export async function up (knex: Knex): Promise<any> {
  console.log('starting');
  await knex.schema.createTable('table_example', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
  });
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema.dropTable('table_example');
}
