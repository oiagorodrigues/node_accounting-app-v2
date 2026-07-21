/**
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} userId
 * @property {string} spentAt
 * @property {string} title
 * @property {number} amount
 * @property {string} category
 * @property {string} note
 */

/**
 * @typedef {Object} CreateExpenseDto
 * @property {string} userId
 * @property {string} spentAt
 * @property {string} title
 * @property {number} amount
 * @property {string} category
 * @property {string} [note]
 */

/**
 * @typedef {Object} PatchExpenseDto
 * @property {string} [title]
 * @property {number} [amount]
 * @property {string} [category]
 * @property {string} [spentAt]
 * @property {string} [note]
 */

/**
 * @typedef {Object} ExpenseFilters
 * @property {string} [userId]
 * @property {string[]} [categories]
 * @property {string} [from]
 * @property {string} [to]
 */

module.exports = {};
