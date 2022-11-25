
import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex('user').del();
  await knex('user').insert([
    {
      id: 1,
      email: 'mock-email@email.com',
      name: 'user 1'
    },
    {
      id: 2,
      email: 'mock-email@email.com',
      name: 'user 2'
    },
    {
      id: 3,
      email: 'mock-email@email.com',
      name: 'user 3'
    },
    {
      id: 4,
      email: 'mock-email@email.com',
      name: 'user 4'
    },
    {
      id: 5,
      email: 'mock-email@email.com',
      name: 'user 5'
    },
    {
      id: 6,
      email: 'mock-email@email.com',
      name: 'user 6'
    },
    {
      id: 7,
      email: 'mock-email@email.com',
      name: 'user 7'
    },
    {
      id: 8,
      email: 'mock-email@email.com',
      name: 'user 8'
    },
    {
      id: 9,
      email: 'mock-email@email.com',
      name: 'user 9'
    },
    {
      id: 10,
      email: 'mock-email@email.com',
      name: 'user 10'
    }
  ]);
};

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('user');
}
