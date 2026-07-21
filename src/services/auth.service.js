'use strict';

/**
 * @typedef {import('../dtos/user.dto').User} User
 * @typedef {import('../dtos/auth.dto').AuthLoginDto} AuthLoginDto
 */

const bcrypt = require('bcrypt');

const jwt = require('../utils/jwt');
const {
  NotFoundError,
  UnprocessableEntityError,
  AuthenticationError,
  AuthorizationError,
} = require('../errors/app.errors');

const usersRepository = require('../repositories/users.repository');
const tokensRepository = require('../repositories/tokens.repository');

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<AuthLoginDto>}
 */
const login = async ({ email, password }) => {
  const user = await usersRepository.getByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, user?.password || '');

  if (!user || !isPasswordValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
  };
};

/**
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken) => {
  const userData = jwt.validateRefreshToken(refreshToken);

  if (userData) {
    await tokensRepository.deleteByUserId(userData.id);
  }
};

/**
 * @param {{ email: string, token: string }} payload
 * @returns {Promise<AuthLoginDto>}
 */
const activate = async ({ email, token }) => {
  const user = await usersRepository.getByEmail(email);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.activationToken === null) {
    throw new UnprocessableEntityError('User already activated');
  }

  if (user.activationToken !== token) {
    throw new UnprocessableEntityError('Invalid activation token');
  }

  await usersRepository.activate(email);

  return {
    id: user.id,
    email: user.email,
  };
};

/**
 * @param {string} refreshToken
 * @returns {Promise<AuthLoginDto>}
 */
const refresh = async (refreshToken) => {
  const userData = jwt.validateRefreshToken(refreshToken);
  const user = await usersRepository.getByEmail(userData?.email || '');
  const token = await tokensRepository.getByToken(refreshToken);

  if (!user || !userData || !token || token.userId !== user.id) {
    throw new AuthorizationError('Invalid token');
  }

  return userData;
};

module.exports = {
  login,
  logout,
  activate,
  refresh,
};
