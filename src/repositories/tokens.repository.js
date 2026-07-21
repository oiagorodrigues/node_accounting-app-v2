'use strict';

/**
 * @typedef {import('../dtos/user.dto').User} User
 * @typedef {import('../dtos/token.dto').Token} Token
 * @typedef {import('../mappers/token.mapper').TokenRow} TokenRow
 */

const { DataAccessError } = require('../errors/app.errors');
const { toToken } = require('../mappers/token.mapper');

const { query } = require('../utils/db');

/**
 * @param {string} userId
 * @param {string} refreshToken
 * @returns {Promise<Token>}
 */
const create = async (userId, refreshToken) => {
  /** @type {import('pg').QueryResult<TokenRow>} */
  const result = await query(
    'INSERT INTO tokens (user_id, token) VALUES ($1, $2) RETURNING *',
    [userId, refreshToken],
  );

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Failed to create token');
  }

  return toToken(row);
};

/**
 * @param {string} token
 * @returns {Promise<Token>}
 */
const getByToken = async (token) => {
  /** @type {import('pg').QueryResult<TokenRow>} */
  const result = await query('SELECT * FROM tokens WHERE token = $1', [token]);

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Token not found');
  }

  return toToken(row);
};

/**
 * @param {string} userId
 * @returns {Promise<Token | undefined>}
 */
const deleteByUserId = async (userId) => {
  /** @type {import('pg').QueryResult<TokenRow>} */
  const result = await query(
    'DELETE FROM tokens WHERE user_id = $1 RETURNING *',
    [userId],
  );

  const row = result.rows[0];

  return row ? toToken(row) : undefined;
};

module.exports = {
  create,
  getByToken,
  deleteByUserId,
};
