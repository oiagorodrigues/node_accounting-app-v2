/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 */

const { DataAccessError } = require('../errors/app.errors');
const { query } = require('../utils/db');

/**
 * @returns {Promise<User[]>}
 */
const getAll = async () => {
  /** @type {import('pg').QueryResult<User>} */
  const result = await query('SELECT * FROM users');

  return result.rows;
};

/**
 * @param {string} id
 * @returns {Promise<User | undefined>}
 */
const getById = async (id) => {
  /** @type {import('pg').QueryResult<User>} */
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);

  return result.rows[0];
};

/**
 * @param {string} name
 * @returns {Promise<User>}
 */
const create = async (name) => {
  /** @type {import('pg').QueryResult<User>} */
  const result = await query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name],
  );

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Failed to create user: no row returned');
  }

  return row;
};

/**
 * @param {string} id
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const patch = async (id, name) => {
  /** @type {import('pg').QueryResult<User>} */
  const result = await query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [name, id],
  );

  return result.rows[0];
};

/**
 * @param {string} id
 * @returns {Promise<User | undefined>}
 */
const remove = async (id) => {
  /** @type {import('pg').QueryResult<User>} */
  const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0];
};

module.exports = {
  create,
  patch,
  remove,
  getAll,
  getById,
};
