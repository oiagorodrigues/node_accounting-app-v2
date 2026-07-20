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

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenses = async (req, res) => {
  const expenses = await expensesService.getExpenses(
    parseExpenseFilters(req.query),
  );

  res.json(expenses);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const createExpense = async (req, res) => {
  const expense = await expensesService.createExpense(
    parseCreateExpenseBody(req.body),
  );

  res.status(201).json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenseById = async (req, res) => {
  const expense = await expensesService.getExpenseById(
    parseExpenseIdParam(req.params),
  );

  res.json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteExpense = async (req, res) => {
  await expensesService.deleteExpense(parseExpenseIdParam(req.params));

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchExpense = async (req, res) => {
  const { id, payload } = parsePatchExpenseInput(req.params, req.body);
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
