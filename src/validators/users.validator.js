'use strict';

/**
 * @typedef {import('./common.validator').ValidationResult<{ name: string }>} CreateUserResult
 * @typedef {import('./common.validator').ValidationResult<{ id: string, name: string }>} PatchUserResult
 * @typedef {import('./common.validator').ValidationResult<string>} UserIdResult
 */

const {
  validateRequired,
  validateString,
  parseIdParam,
} = require('./common.validator');
const { fieldErrors, compactErrors } = require('./utils');

/**
 * @param {{ name?: unknown }} body
 * @returns {CreateUserResult}
 */
const parseCreateUserBody = (body) => {
  const { name } = body;

  const errors = compactErrors({
    name: fieldErrors(
      validateRequired(name, 'Name is required'),
      validateString(name, 'Name must be a string'),
    ),
  });

  if (errors) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: { name: /** @type {string} */ (name) },
  };
};

/**
 * @param {{ id?: string }} params
 * @param {{ name?: unknown }} body
 * @returns {PatchUserResult}
 */
const parsePatchUserInput = (params, body) => {
  const idResult = parseIdParam(params.id);
  const { name } = body;

  const errors = compactErrors({
    id: idResult.ok ? undefined : idResult.errors.id,
    name: fieldErrors(
      validateRequired(name, 'Name is required'),
      validateString(name, 'Name must be a string'),
    ),
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
      name: /** @type {string} */ (name),
    },
  };
};

/**
 * @param {{ id?: string }} params
 * @returns {UserIdResult}
 */
const parseUserIdParam = (params) => parseIdParam(params.id);

module.exports = {
  parseCreateUserBody,
  parsePatchUserInput,
  parseUserIdParam,
};
