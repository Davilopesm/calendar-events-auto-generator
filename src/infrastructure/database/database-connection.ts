
import Knex from 'knex';
import dbConfig from './database-config';

const databaseConnection = Knex(dbConfig)

export default databaseConnection;
