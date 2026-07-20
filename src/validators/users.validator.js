'use strict';

const {
  assertRequired,
  assertString,
  parseIdParam,
} = require('./common.validator');

/**
 * @param {{ name?: unknown }} body
 * @returns {{ name: string }}
 */
const parseCreateUserBody = (body) => {
  const { name } = body;

  assertRequired(name, 'Name is required');
  assertString(name, 'Name must be a string');

  return { name };
};

/**
 * @param {{ id?: string }} params
 * @param {{ name?: unknown }} body
 * @returns {{ id: number, name: string }}
 */
const parsePatchUserInput = (params, body) => {
  const id = parseIdParam(params.id);
  const { name } = body;

  assertRequired(name, 'Name is required');
  assertString(name, 'Name must be a string');

  return { id, name };
};

/**
 * @param {{ id?: string }} params
 * @returns {number}
 */
const parseUserIdParam = (params) => parseIdParam(params.id);

module.exports = {
  parseCreateUserBody,
  parsePatchUserInput,
  parseUserIdParam,
};
