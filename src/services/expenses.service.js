/**
 * @typedef {import('../dtos/expense.dto').Expense} Expense
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 */

const { ValidationError, NotFoundError } = require('../errors/app.errors');
const expensesRepository = require('../repositories/expenses.repository');
const usersRepository = require('../repositories/users.repository');

/**
 * @param {ExpenseFilters} [filters={}]
 * @returns {Promise<Array<Expense>>}
 */
const getExpenses = async (filters = {}) => {
  return expensesRepository.getAll(filters);
};

/**
 * @param {number} id
 * @returns {Promise<Expense>}
 */
const getExpenseById = async (id) => {
  const expense = await expensesRepository.getById(id);

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  return expense;
};

/**
 * @param {CreateExpenseDto} payload
 * @returns {Promise<Expense>}
 */
const createExpense = async (payload) => {
  const user = await usersRepository.getById(payload.userId);

  if (!user) {
    throw new ValidationError('User not found');
  }

  return expensesRepository.create(payload);
};

/**
 * @param {number} id
 * @returns {Promise<Expense>}
 */
const deleteExpense = async (id) => {
  const expense = await expensesRepository.getById(Number(id));

  if (!expense) {
    throw new NotFoundError('Expense not found');
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
    throw new NotFoundError('Expense not found');
  }

  return expensesRepository.patch(Number(id), payload);
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
};
