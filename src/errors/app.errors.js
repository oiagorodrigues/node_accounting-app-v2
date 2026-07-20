'use strict';

/**
 * Used to indicate that there was an error in the application.
 * Ex.: Invalid request, resource not found, etc.
 */
class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   * @param {{ cause?: unknown }} [options]
   */
  constructor(message, statusCode = 500, options) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

/**
 * Used to indicate that the request was invalid.
 * Ex.: Missing required fields, invalid data types, etc.
 */
class ValidationError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 400);
  }
}

/**
 * Used to indicate that the requested resource was not found.
 * Ex.: User not found, product not found, etc.
 */
class NotFoundError extends AppError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
  }
}

/**
 * Used to indicate that there was an error accessing the data.
 * Ex.: Database connection error, data retrieval error, etc.
 */
class DataAccessError extends AppError {
  /**
   * @param {string} message
   * @param {{ cause?: unknown }} [options]
   */
  constructor(message, options) {
    super(message, 500, options);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  DataAccessError,
};
