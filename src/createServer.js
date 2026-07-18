'use strict';

const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users.route');
const expensesRoutes = require('./routes/expenses.route');

const usersService = require('./services/users.service');
const expensesService = require('./services/expenses.service');

function createServer() {
  usersService.resetUsers();
  expensesService.resetExpenses();

  // Use express to create a server
  // Add a routes to the server
  // Return the server (express app)
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/users', usersRoutes);
  app.use('/expenses', expensesRoutes);

  return app;
}

module.exports = {
  createServer,
};
