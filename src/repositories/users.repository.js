/**
 * @typedef {import('../dtos/user.dto').User} User
 * @typedef {import('../dtos/user.dto').CreateUserDto} CreateUserDto
 * @typedef {import('../dtos/user.dto').PatchUserDto} PatchUserDto
 * @typedef {import('../mappers/user.mapper').UserRow} UserRow
 */

const { DataAccessError } = require('../errors/app.errors');
const { query } = require('../utils/db');
const { UserDtoFieldToColumn, toUser } = require('../mappers/user.mapper');

/** @type {Array<keyof PatchUserDto>} */
const patchableFields = ['name', 'email', 'password'];

/**
 * @returns {Promise<User[]>}
 */
const getAll = async () => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query('SELECT * FROM users');

  return result.rows.map(toUser);
};

/**
 * @returns {Promise<User[]>}
 */
const getAllActive = async () => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query(
    'SELECT * FROM users WHERE activation_token IS NULL',
  );

  return result.rows.map(toUser);
};

/**
 * @param {string} id
 * @returns {Promise<User | undefined>}
 */
const getById = async (id) => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);

  return result.rows[0] ? toUser(result.rows[0]) : undefined;
};

/**
 * @param {string} email
 * @returns {Promise<User | undefined>}
 */
const getByEmail = async (email) => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);

  return result.rows[0] ? toUser(result.rows[0]) : undefined;
};

/**
 * @param {CreateUserDto} payload
 * @returns {Promise<User>}
 */
const create = async ({ name, email, password, activationToken }) => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query(
    'INSERT INTO users (name, email, password, activation_token) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, password, activationToken],
  );

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Failed to create user: no row returned');
  }

  return toUser(row);
};

/**
 * @param {string} id
 * @param {PatchUserDto} payload
 * @returns {Promise<User | undefined>}
 */
const patch = async (id, payload) => {
  const updates = [];
  const values = [];

  for (const field of patchableFields) {
    if (payload[field] !== undefined) {
      updates.push(`${UserDtoFieldToColumn[field]} = $${values.length + 1}`);
      values.push(payload[field]);
    }
  }

  if (updates.length === 0) {
    return getById(id);
  }

  values.push(id);

  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  );

  return result.rows[0] ? toUser(result.rows[0]) : undefined;
};

/**
 * @param {string} id
 * @returns {Promise<User | undefined>}
 */
const remove = async (id) => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0] ? toUser(result.rows[0]) : undefined;
};

/**
 * @param {string} email
 * @returns {Promise<User>}
 */
const activate = async (email) => {
  /** @type {import('pg').QueryResult<UserRow>} */
  const result = await query(
    'UPDATE users SET activation_token = NULL WHERE email = $1 RETURNING *',
    [email],
  );

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Failed to activate user: no row returned');
  }

  return toUser(row);
};

module.exports = {
  create,
  patch,
  remove,
  getAll,
  getAllActive,
  getById,
  getByEmail,
  activate,
};
