'use strict';

const { ValidationError, AppError } = require('../errors/app.errors');

/**
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const errorsMiddleware = (err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ValidationError && err.errors) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });

    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });

    return;
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

  res.status(500).json({ error: message });
};

module.exports = errorsMiddleware;
