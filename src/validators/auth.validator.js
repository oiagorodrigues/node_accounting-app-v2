'use strict';

/**
 * @typedef {import('../dtos/user.dto').CreateUserDto} CreateUserDto
 * @typedef {import('./common.validator').ValidationResult<CreateUserDto>} AuthRegisterResult
 * @typedef {import('./common.validator').ValidationResult<{ email: string, token: string }>} AuthActivateResult
 * @typedef {import('./common.validator').ValidationResult<{ email: string, password: string }>} AuthLoginBodyResult
 */

const {
  validateRequired,
  validateString,
  validateEmail,
  validateMinLength,
} = require('./common.validator');
const { fieldErrors, compactErrors } = require('./utils');

/**
 * @param {CreateUserDto} body
 * @returns {AuthRegisterResult}
 */
const parseAuthRegisterBody = (body) => {
  const { name, email, password } = body;

  const errors = compactErrors({
    name: fieldErrors(
      validateRequired(name, 'Name is required'),
      validateString(name, 'Name must be a string'),
    ),
    email: fieldErrors(
      validateRequired(email, 'Email is required'),
      validateString(email, 'Email must be a string'),
      typeof email === 'string'
        ? validateEmail(email, 'Email is invalid')
        : undefined,
    ),
    password: fieldErrors(
      validateRequired(password, 'Password is required'),
      validateString(password, 'Password must be a string'),
      validateMinLength(
        password,
        6,
        'Password must be at least 6 characters long',
      ),
    ),
  });

  if (errors) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      name: /** @type {string} */ (name),
      email: /** @type {string} */ (email),
      password: /** @type {string} */ (password),
    },
  };
};

/**
 * @param {import('express').Request['params']} params
 * @returns {AuthActivateResult}
 */
const parseAuthActivateParams = ({ email, token }) => {
  const errors = compactErrors({
    email: fieldErrors(
      validateRequired(email, 'Email is required'),
      validateString(email, 'Email must be a string'),
      typeof email === 'string'
        ? validateEmail(email, 'Email is invalid')
        : undefined,
    ),
    token: fieldErrors(
      validateRequired(token, 'Token is required'),
      validateString(token, 'Token must be a string'),
      typeof token === 'string'
        ? validateMinLength(token, 1, 'Token must be at least 1 character long')
        : undefined,
    ),
  });

  if (errors) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      email: /** @type {string} */ (email),
      token: /** @type {string} */ (token),
    },
  };
};

/**
 * @param {{ email: string, password: string }} body
 * @returns {AuthLoginBodyResult}
 */
const parseAuthLoginBody = ({ email, password }) => {
  const errors = compactErrors({
    email: fieldErrors(
      validateRequired(email, 'Email is required'),
      validateString(email, 'Email must be a string'),
      typeof email === 'string'
        ? validateEmail(email, 'Email invalid')
        : undefined,
    ),
    password: fieldErrors(
      validateRequired(password, 'Password is required'),
      validateString(password, 'Password must be a string'),
      validateMinLength(
        password,
        6,
        'Password must be at least 6 characters long',
      ),
    ),
  });

  if (errors) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      email: /** @type {string} */ (email),
      password: /** @type {string} */ (password),
    },
  };
};

module.exports = {
  parseAuthRegisterBody,
  parseAuthActivateParams,
  parseAuthLoginBody,
};
