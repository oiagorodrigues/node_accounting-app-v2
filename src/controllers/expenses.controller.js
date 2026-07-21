/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const expensesService = require('../services/expenses.service');
const {
  parseExpenseFilters,
  parseCreateExpenseBody,
  parsePatchExpenseInput,
  parseExpenseIdParam,
} = require('../validators/expenses.validator');
const { assertValid } = require('../validators/common.validator');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenses = async (req, res) => {
  const filters = assertValid(parseExpenseFilters(req.query));
  const expenses = await expensesService.getExpenses(filters);

  res.json(expenses);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const createExpense = async (req, res) => {
  const payload = assertValid(parseCreateExpenseBody(req.body));
  const expense = await expensesService.createExpense(payload);

  res.status(201).json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenseById = async (req, res) => {
  const id = assertValid(parseExpenseIdParam(req.params));
  const expense = await expensesService.getExpenseById(id);

  res.json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteExpense = async (req, res) => {
  const id = assertValid(parseExpenseIdParam(req.params));

  await expensesService.deleteExpense(id);

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchExpense = async (req, res) => {
  const { id, payload } = assertValid(
    parsePatchExpenseInput(req.params, req.body),
  );
  const expense = await expensesService.patchExpense(id, payload);

  res.json(expense);
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
};
