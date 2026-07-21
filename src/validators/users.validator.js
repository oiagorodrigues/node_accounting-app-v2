'use strict';

/**
 * @typedef {import('../dtos/user.dto').User} User
 * @typedef {import('../dtos/user.dto').PatchUserDto} PatchUserDto
 * @typedef {import('./common.validator').ValidationResult<User>} PatchUserResult
 * @typedef {import('./common.validator').ValidationResult<string>} UserIdResult
 */

const {
  validateRequired,
  validateString,
  parseIdParam,
  validateEmail,
} = require('./common.validator');
const { fieldErrors, compactErrors } = require('./utils');

/**
 * @param {{ id?: string }} params
 * @param {PatchUserDto} body
 * @returns {PatchUserResult}
 */
const parsePatchUserInput = (params, body) => {
  const idResult = parseIdParam(params.id);
  const { name, email, password } = body;

  /** @type {string[] | undefined} */
  let nameErrors;
  /** @type {string[] | undefined} */
  let emailErrors;
  /** @type {string[] | undefined} */
  let passwordErrors;

  if (name) {
    nameErrors = fieldErrors(validateString(name, 'Name must be a string'));
  }

  if (email) {
    emailErrors = fieldErrors(
      validateRequired(email, 'Email is required'),
      validateString(email, 'Email must be a string'),
      typeof email === 'string'
        ? validateEmail(email, 'Email is invalid')
        : undefined,
    );
  }

  if (password) {
    passwordErrors = fieldErrors(
      validateRequired(password, 'Password is required'),
      validateString(password, 'Password must be a string'),
    );
  }

  const errors = compactErrors({
    id: idResult.ok ? undefined : idResult.errors.id,
    name: nameErrors,
    email: emailErrors,
    password: passwordErrors,
  });

  if (errors) {
    return { ok: false, errors };
  }

  if (!idResult.ok) {
    return idResult;
  }

  return {
    ok: true,
    payload: {
      id: idResult.payload,
      name,
      email: /** @type {string} */ (email),
      password: /** @type {string} */ (password),
    },
  };
};

/**
 * @param {{ id?: string }} params
 * @returns {UserIdResult}
 */
const parseUserIdParam = (params) => parseIdParam(params.id);

module.exports = {
  parsePatchUserInput,
  parseUserIdParam,
};
