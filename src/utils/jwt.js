'use strict';

/**
 * @typedef {import('../dtos/user.dto').User} User
 * @typedef {import('../dtos/auth.dto').AuthLoginDto} AuthLoginDto
 */

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_ACCESS_SECRET || '';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

/**
 * @param {Pick<User, 'id' | 'email'>} user
 * @returns {string}
 */
const generateAccessToken = (user) => {
  return jwt.sign(user, SECRET, { expiresIn: '1m' });
};

/**
 * @param {Pick<User, 'id' | 'email'>} user
 * @returns {string}
 */
const generateRefreshToken = (user) => {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: '90s' });
};

/**
 * @param {string} token
 * @returns {AuthLoginDto | null}
 */
const validateAccessToken = (token) => {
  try {
    return /** @type {AuthLoginDto} */ (jwt.verify(token, SECRET));
  } catch (error) {
    return null;
  }
};

/**
 * @param {string} token
 * @returns {AuthLoginDto | null}
 */
const validateRefreshToken = (token) => {
  try {
    return /** @type {AuthLoginDto} */ (jwt.verify(token, REFRESH_SECRET));
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};
