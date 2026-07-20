/**
 * @typedef {import('../dtos/expense.dto').Expense} Expense
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 * @typedef {import('../mappers/expense.mapper').ExpenseRow} ExpenseRow
 */

const { db } = require('../utils/db');
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

  let query = 'SELECT * FROM expenses';

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  try {
    /** @type {import('pg').QueryResult<ExpenseRow>} */
    const result = await db.query(query, values);

    return result.rows.map(toExpense);
  } catch (error) {
    throw new Error(`Failed to get all expenses: ${error}`);
  }
};

/**
 * @param {number} id
 * @returns {Promise<Expense | undefined>}
 */
const getById = async (id) => {
  try {
    /** @type {import('pg').QueryResult<ExpenseRow>} */
    const result = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);

    return result.rows[0] ? toExpense(result.rows[0]) : undefined;
  } catch (error) {
    throw new Error(`Failed to get expense by id: ${error}`);
  }
};

/**
 * @param {CreateExpenseDto} payload
 * @returns {Promise<Expense | undefined>}
 */
const create = async (payload) => {
  try {
    /** @type {import('pg').QueryResult<ExpenseRow>} */
    const result = await db.query(
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

    return result.rows[0] ? toExpense(result.rows[0]) : undefined;
  } catch (error) {
    throw new Error(`Failed to create expense: ${error}`);
  }
};

/**
 * @param {number} id
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

  try {
    /** @type {import('pg').QueryResult<ExpenseRow>} */
    const result = await db.query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values,
    );

    return result.rows[0] ? toExpense(result.rows[0]) : undefined;
  } catch (error) {
    throw new Error(`Failed to patch expense: ${error}`);
  }
};

/**
 * @param {number} id
 * @returns {Promise<Expense | undefined>}
 */
const remove = async (id) => {
  try {
    /** @type {import('pg').QueryResult<ExpenseRow>} */
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id],
    );

    return result.rows[0] ? toExpense(result.rows[0]) : undefined;
  } catch (error) {
    throw new Error(`Failed to delete expense: ${error}`);
  }
};

module.exports = {
  create,
  patch,
  remove,
  getAll,
  getById,
};
