'use strict';

/**
 * @typedef {Object} TokenRow
 * @property {string} id
 * @property {string} user_id
 * @property {string} token
 *
 * @typedef {import('../dtos/token.dto').Token} Token
 */

/**
 * @param {TokenRow} token
 * @returns {Token}
 */
const toToken = (token) => ({
  id: token.id,
  userId: token.user_id,
  refreshToken: token.token,
});

module.exports = {
  toToken,
};
