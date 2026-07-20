'use strict';

const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users.route');
const expensesRoutes = require('./routes/expenses.route');
const { AppError } = require('./errors/app.errors');

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/users', usersRoutes);
  app.use('/expenses', expensesRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use(
    /**
     * @param {Error} err
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    (err, req, res, next) => {
      // eslint-disable-next-line no-console
      console.error(err);

      if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });

        return;
      }

      const message =
        process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : err.message;

      res.status(500).json({ error: message });
    },
  );

  return app;
}

module.exports = {
  createServer,
};
