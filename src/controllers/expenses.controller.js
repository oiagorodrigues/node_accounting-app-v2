/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 *
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 */

const expensesService = require('../services/expenses.service');
const usersService = require('../services/users.service');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenses = async (req, res) => {
  const { userId, categories, from, to } = req.query;

  /** @type {ExpenseFilters} */
  const filters = {
    userId: userId ? Number(userId) : undefined,
    categories: categories ? String(categories).split(',') : undefined,
    from: from ? new Date(String(from)).toISOString() : undefined,
    to: to ? new Date(String(to)).toISOString() : undefined,
  };
  const expenses = await expensesService.getExpenses(filters);

  res.json(expenses);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const createExpense = async (req, res) => {
  /** @type {CreateExpenseDto} */
  const { userId, spentAt, title, amount, category, note = '' } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });

    return;
  }

  if (!spentAt) {
    res.status(400).json({ error: 'Spent at is required' });

    return;
  }

  if (!title) {
    res.status(400).json({ error: 'Title is required' });

    return;
  }

  if (!amount) {
    res.status(400).json({ error: 'Amount is required' });

    return;
  }

  if (!category) {
    res.status(400).json({ error: 'Category is required' });

    return;
  }

  const user = await usersService.getUserById(userId);

  if (!user) {
    res.status(400).json({ error: 'User not found' });

    return;
  }

  const expense = await expensesService.createExpense({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  if (!expense) {
    res.status(500).json({ error: 'Failed to create a new expense' });

    return;
  }

  res.status(201).json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getExpenseById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  const expense = await expensesService.getExpenseById(Number(id));

  if (!expense) {
    res.status(404).json({ error: 'Expense not found' });

    return;
  }

  res.json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  const expense = await expensesService.deleteExpense(Number(id));

  if (!expense) {
    res.status(404).json({ error: 'Expense not found' });

    return;
  }

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchExpense = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  /** @type {PatchExpenseDto} */
  const payload = {
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    note: req.body.note,
    spentAt: req.body.spentAt
      ? new Date(req.body.spentAt).toISOString()
      : undefined,
  };

  const expense = await expensesService.patchExpense(Number(id), payload);

  if (!expense) {
    res.status(404).json({ error: 'Expense not found' });

    return;
  }

  res.json(expense);
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
};
