'use strict';

const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users.route');
const expensesRouter = require('./routes/expenses.route');
const errorsMiddleware = require('./middlewares/errors.middleware');

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/users', usersRouter);
  app.use('/expenses', expensesRouter);

  app.use(errorsMiddleware);

  return app;
}

module.exports = {
  createServer,
};
