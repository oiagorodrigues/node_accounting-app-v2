'use strict';

const { ValidationError } = require('../errors/app.errors');
const { fieldErrors } = require('./utils');

/**
 * @typedef {{ ok: true, payload: T } | { ok: false, errors: Record<string, string[]> }} ValidationResult
 * @template T
 */

/**
 * @param {unknown} value
 * @param {string} message
 * @returns {string | undefined}
 */
const validateRequired = (value, message) => {
  if (value === undefined || value === null || value === '') {
    return message;
  }
};

/**
 * @param {unknown} value
 * @param {string} message
 * @returns {string | undefined}
 */
const validateString = (value, message) => {
  if (typeof value !== 'string') {
    return message;
  }
};

/**
 * @param {string} value
 * @param {string} message
 * @returns {string | undefined}
 */
const validateEmail = (value, message) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return message;
  }
};

/**
 * @param {string} value
 * @param {string} message
 * @returns {string | undefined}
 */
const validateUuid = (value, message) => {
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      value,
    )
  ) {
    return message;
  }
};

/**
 * @param {string} value
 * @param {number} minLength
 * @param {string} message
 * @returns {string | undefined}
 */
const validateMinLength = (value, minLength, message) => {
  if (typeof value !== 'string' || value.length < minLength) {
    return message;
  }
};

/**
 * @param {string} value
 * @param {number} maxLength
 * @param {string} message
 * @returns {string | undefined}
 */
const validateMaxLength = (value, maxLength, message) => {
  if (typeof value !== 'string' || value.length > maxLength) {
    return message;
  }
};

/**
 * @param {string | undefined} id
 * @returns {ValidationResult<string>}
 */
const parseIdParam = (id) => {
  const errors = fieldErrors(
    validateRequired(id, 'ID is required'),
    validateString(id, 'ID must be a string'),
    typeof id === 'string'
      ? validateUuid(id, 'ID must be a valid UUID')
      : undefined,
  );

  if (errors) {
    return { ok: false, errors: { id: errors } };
  }

  return { ok: true, payload: /** @type {string} */ (id) };
};

/**
 * @template T
 * @param {ValidationResult<T>} result
 * @returns {T}
 */
const assertValid = (result) => {
  if (!result.ok) {
    throw new ValidationError('Validation error', result.errors);
  }

  return result.payload;
};

module.exports = {
  validateRequired,
  validateString,
  validateEmail,
  validateUuid,
  validateMinLength,
  validateMaxLength,
  parseIdParam,
  assertValid,
};
