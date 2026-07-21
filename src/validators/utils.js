'use strict';

/**
 * Collects every failed check for a single field.
 *
 * @param {...(string | undefined)} messages
 * @returns {string[] | undefined}
 */
const fieldErrors = (...messages) => {
  /** @type {string[]} */
  const errors = [];

  for (const message of messages) {
    if (message) {
      errors.push(message);
    }
  }

  if (errors.length === 0) {
    return undefined;
  }

  return errors;
};

/**
 * @param {Record<string, string[] | undefined>} errors
 * @returns {Record<string, string[]> | undefined}
 */
const compactErrors = (errors) => {
  /** @type {Record<string, string[]>} */
  const compacted = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (messages?.length) {
      compacted[field] = messages;
    }
  }

  if (Object.keys(compacted).length === 0) {
    return undefined;
  }

  return compacted;
};

module.exports = {
  fieldErrors,
  compactErrors,
};
