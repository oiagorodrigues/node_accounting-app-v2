const expensesService = require('../services/expenses.service');
const usersService = require('../services/users.service');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getExpenses = (req, res) => {
  const { userId = '', categories = [], from = '', to = '' } = req.query;
  const expenses = expensesService.getExpenses({
    userId,
    categories,
    from,
    to,
  });

  res.json(expenses);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const createExpense = (req, res) => {
  const { userId, spentAt, title, amount, category, note = '' } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!spentAt) {
    return res.status(400).json({ error: 'Spent at is required' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  const user = usersService.getUserById(userId);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const expense = expensesService.createExpense({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  res.status(201).json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getExpenseById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const expense = expensesService.getExpenseById(Number(id));

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json(expense);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const deleteExpense = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const expense = expensesService.deleteExpense(Number(id));

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  return res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const patchExpense = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const { title, amount, category, spentAt, note } = req.body;

  const expense = expensesService.patchExpense(Number(id), {
    title,
    amount,
    category,
    spentAt,
    note,
  });

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  return res.json(expense);
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
};
