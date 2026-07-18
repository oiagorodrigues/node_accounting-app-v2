const { Router } = require('express');
const expensesController = require('../controllers/expenses.controller');

const expensesRouter = new Router();

expensesRouter.get('/', expensesController.getExpenses);
expensesRouter.post('/', expensesController.createExpense);
expensesRouter.get('/:id', expensesController.getExpenseById);
expensesRouter.delete('/:id', expensesController.deleteExpense);
expensesRouter.patch('/:id', expensesController.patchExpense);

module.exports = expensesRouter;
