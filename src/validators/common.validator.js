'use strict';

const { ValidationError } = require('../errors/app.errors');

/**
 * @param {unknown} value
 * @param {string} message
 * @returns {void}
 */
const assertRequired = (value, message) => {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(message);
  }
};

/**
 * @param {unknown} value
 * @param {string} message
 * @returns {asserts value is string}
 */
const assertString = (value, message) => {
  if (typeof value !== 'string') {
    throw new ValidationError(message);
  }
};

/**
 * @param {string | undefined} id
 * @returns {number}
 */
const parseIdParam = (id) => {
  assertRequired(id, 'ID is required');

  return Number(id);
};

module.exports = {
  assertRequired,
  assertString,
  parseIdParam,
};
