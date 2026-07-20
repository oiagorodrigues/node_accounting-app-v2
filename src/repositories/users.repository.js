/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 */

const { db } = require('../utils/db');

/**
 * @returns {Promise<User[]>}
 */
const getAll = async () => {
  try {
    /** @type {import('pg').QueryResult<User>} */
    const result = await db.query('SELECT * FROM users');

    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get all users: ${error}`);
  }
};

/**
 * @param {number} id
 * @returns {Promise<User | undefined>}
 */
const getById = async (id) => {
  try {
    /** @type {import('pg').QueryResult<User>} */
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to get user by id: ${error}`);
  }
};

/**
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const create = async (name) => {
  try {
    /** @type {import('pg').QueryResult<User>} */
    const result = await db.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
};

/**
 * @param {number} id
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const patch = async (id, name) => {
  try {
    /** @type {import('pg').QueryResult<User>} */
    const result = await db.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to patch user: ${error}`);
  }
};

/**
 * @param {number} id
 * @returns {Promise<User | undefined>}
 */
const remove = async (id) => {
  try {
    /** @type {import('pg').QueryResult<User>} */
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to delete user: ${error}`);
  }
};

module.exports = {
  create,
  patch,
  remove,
  getAll,
  getById,
};
