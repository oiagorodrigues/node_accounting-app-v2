/**
 * @typedef {import('../dtos/expense.dto').Expense} Expense
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 * @typedef {import('../mappers/expense.mapper').ExpenseRow} ExpenseRow
 */

const { DataAccessError } = require('../errors/app.errors');
const { query } = require('../utils/db');
const {
  ExpenseDtoFieldToColumn,
  toExpense,
} = require('../mappers/expense.mapper');

/** @type {Array<keyof PatchExpenseDto>} */
const patchableFields = ['title', 'amount', 'category', 'spentAt', 'note'];

/**
 * @param {ExpenseFilters} [filters={}]
 * @returns {Promise<Expense[]>}
 */
const getAll = async ({ userId, categories, from, to } = {}) => {
  const conditions = [];
  const values = [];

  if (userId) {
    conditions.push(`user_id = $${values.length + 1}`);
    values.push(userId);
  }

  if (categories?.length) {
    conditions.push(`category = ANY($${values.length + 1})`);
    values.push(categories);
  }

  if (from) {
    conditions.push(`spent_at >= $${values.length + 1}`);
    values.push(from);
  }

  if (to) {
    conditions.push(`spent_at <= $${values.length + 1}`);
    values.push(to);
  }

  let sql = 'SELECT * FROM expenses';

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  /** @type {import('pg').QueryResult<ExpenseRow>} */
  const result = await query(sql, values);

  return result.rows.map(toExpense);
};

/**
 * @param {string} id
 * @returns {Promise<Expense | undefined>}
 */
const getById = async (id) => {
  /** @type {import('pg').QueryResult<ExpenseRow>} */
  const result = await query('SELECT * FROM expenses WHERE id = $1', [id]);

  return result.rows[0] ? toExpense(result.rows[0]) : undefined;
};

/**
 * @param {CreateExpenseDto} payload
 * @returns {Promise<Expense>}
 */
const create = async (payload) => {
  /** @type {import('pg').QueryResult<ExpenseRow>} */
  const result = await query(
    /* eslint-disable-next-line max-len */
    'INSERT INTO expenses (user_id, title, amount, category, spent_at, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      payload.userId,
      payload.title,
      payload.amount,
      payload.category,
      payload.spentAt,
      payload.note ?? '',
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new DataAccessError('Failed to create expense: no row returned');
  }

  return toExpense(row);
};

/**
 * @param {string} id
 * @param {PatchExpenseDto} payload
 * @returns {Promise<Expense | undefined>}
 */
const patch = async (id, payload) => {
  const updates = [];
  const values = [];

  for (const field of patchableFields) {
    if (payload[field] !== undefined) {
      updates.push(`${ExpenseDtoFieldToColumn[field]} = $${values.length + 1}`);
      values.push(payload[field]);
    }
  }

  if (updates.length === 0) {
    return getById(id);
  }

  values.push(id);

  /** @type {import('pg').QueryResult<ExpenseRow>} */
  const result = await query(
    `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  );

  return result.rows[0] ? toExpense(result.rows[0]) : undefined;
};

/**
 * @param {string} id
 * @returns {Promise<Expense | undefined>}
 */
const remove = async (id) => {
  /** @type {import('pg').QueryResult<ExpenseRow>} */
  const result = await query('DELETE FROM expenses WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0] ? toExpense(result.rows[0]) : undefined;
};

module.exports = {
  create,
  patch,
  remove,
  getAll,
  getById,
};
