'use strict';

/**
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 * @typedef {import('./common.validator').ValidationResult<CreateExpenseDto>} CreateExpenseResult
 * @typedef {import('./common.validator').ValidationResult<{ id: string, payload: PatchExpenseDto }>} PatchExpenseResult
 * @typedef {import('./common.validator').ValidationResult<string>} ExpenseIdResult
 * @typedef {import('./common.validator').ValidationResult<ExpenseFilters>} ExpenseFiltersResult
 */

const {
  validateRequired,
  validateString,
  parseIdParam,
} = require('./common.validator');
const { fieldErrors, compactErrors } = require('./utils');

/**
 * @param {import('express').Request['query']} query
 * @returns {ExpenseFiltersResult}
 */
const parseExpenseFilters = (query) => {
  const { userId, categories, from, to } = query;

  return {
    ok: true,
    payload: {
      userId: userId ? String(userId) : undefined,
      categories: categories ? String(categories).split(',') : undefined,
      from: from ? new Date(String(from)).toISOString() : undefined,
      to: to ? new Date(String(to)).toISOString() : undefined,
    },
  };
};

/**
 * @param {CreateExpenseDto} body
 * @returns {CreateExpenseResult}
 */
const parseCreateExpenseBody = (body) => {
  const { userId, spentAt, title, amount, category, note = '' } = body;

  const errors = compactErrors({
    userId: fieldErrors(validateRequired(userId, 'User ID is required')),
    spentAt: fieldErrors(
      validateRequired(spentAt, 'Spent at is required'),
      validateString(spentAt, 'Spent at must be a string'),
    ),
    title: fieldErrors(
      validateRequired(title, 'Title is required'),
      validateString(title, 'Title must be a string'),
    ),
    amount: fieldErrors(validateRequired(amount, 'Amount is required')),
    category: fieldErrors(
      validateRequired(category, 'Category is required'),
      validateString(category, 'Category must be a string'),
    ),
  });

  if (errors) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      userId,
      spentAt,
      title,
      amount,
      category,
      note,
    },
  };
};

/**
 * @param {{ id?: string }} params
 * @param {PatchExpenseDto} body
 * @returns {PatchExpenseResult}
 */
const parsePatchExpenseInput = (params, body) => {
  const idResult = parseIdParam(params.id);

  if (!idResult.ok) {
    return idResult;
  }

  return {
    ok: true,
    payload: {
      id: idResult.payload,
      payload: {
        title: body.title === undefined ? undefined : String(body.title),
        amount: body.amount === undefined ? undefined : Number(body.amount),
        category:
          body.category === undefined ? undefined : String(body.category),
        note: body.note === undefined ? undefined : String(body.note),
        spentAt: body.spentAt
          ? new Date(String(body.spentAt)).toISOString()
          : undefined,
      },
    },
  };
};

/**
 * @param {{ id?: string }} params
 * @returns {ExpenseIdResult}
 */
const parseExpenseIdParam = (params) => parseIdParam(params.id);

module.exports = {
  parseExpenseFilters,
  parseCreateExpenseBody,
  parsePatchExpenseInput,
  parseExpenseIdParam,
};
