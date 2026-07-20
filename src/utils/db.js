'use strict';

const pg = require('pg');
const dotenv = require('dotenv');
const { DataAccessError } = require('../errors/app.errors');

dotenv.config();

// Creating a pool of connections to the database
// So we can reuse the connections and avoid
// creating a new connection for each request
const db = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * @template {import('pg').QueryResultRow} T
 * @param {string} sql
 * @param {unknown[]} [params]
 * @returns {Promise<import('pg').QueryResult<T>>}
 */
const query = async (sql, params = []) => {
  try {
    return /** @type {import('pg').QueryResult<T>} */ (
      await db.query(sql, params)
    );
  } catch (error) {
    throw new DataAccessError(`Failed to run query`, { cause: error });
  }
};

module.exports = {
  db,
  query,
};
