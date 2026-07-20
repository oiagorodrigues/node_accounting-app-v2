/**
 * @typedef {import('../dtos/expense.dto').Expense} Expense
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 */

const expensesRepository = require('../repositories/expenses.repository');

/**
 * @param {ExpenseFilters} [filters={}]
 * @returns {Promise<Array<Expense>>}
 */
const getExpenses = async (filters = {}) => {
  const expenses = await expensesRepository.getAll(filters);

  return expenses;
};

/**
 * @param {number} id
 * @returns {Promise<Expense | undefined>}
 */
const getExpenseById = async (id) => {
  const expense = await expensesRepository.getById(id);

  return expense;
};

/**
 * @param {CreateExpenseDto} payload
 * @returns {Promise<Expense | undefined>}
 */
const createExpense = async (payload) => {
  const expense = await expensesRepository.create(payload);

  if (!expense) {
    return;
  }

  return expense;
};

/**
 * @param {number} id
 * @returns {Promise<Expense | undefined>}
 */
const deleteExpense = async (id) => {
  const expense = await expensesRepository.getById(Number(id));

  if (!expense) {
    return;
  }

  await expensesRepository.remove(Number(id));

  return expense;
};

/**
 * @param {number} id
 * @param {PatchExpenseDto} payload
 * @returns {Promise<Expense | undefined>}
 */
const patchExpense = async (id, payload) => {
  const expense = await expensesRepository.getById(Number(id));

  if (!expense) {
    return;
  }

  const patchedExpense = await expensesRepository.patch(Number(id), payload);

  return patchedExpense;
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
};
