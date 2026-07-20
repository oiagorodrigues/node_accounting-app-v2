'use strict';

const {
  assertRequired,
  assertString,
  parseIdParam,
} = require('./common.validator');

/**
 * @typedef {import('../dtos/expense.dto').CreateExpenseDto} CreateExpenseDto
 * @typedef {import('../dtos/expense.dto').PatchExpenseDto} PatchExpenseDto
 * @typedef {import('../dtos/expense.dto').ExpenseFilters} ExpenseFilters
 */

/**
 * @param {import('express').Request['query']} query
 * @returns {ExpenseFilters}
 */
const parseExpenseFilters = (query) => {
  const { userId, categories, from, to } = query;

  return {
    userId: userId ? Number(userId) : undefined,
    categories: categories ? String(categories).split(',') : undefined,
    from: from ? new Date(String(from)).toISOString() : undefined,
    to: to ? new Date(String(to)).toISOString() : undefined,
  };
};

/**
 * @param {Record<string, unknown>} body
 * @returns {CreateExpenseDto}
 */
const parseCreateExpenseBody = (body) => {
  const { userId, spentAt, title, amount, category, note = '' } = body;

  assertRequired(userId, 'User ID is required');
  assertRequired(spentAt, 'Spent at is required');
  assertRequired(title, 'Title is required');
  assertRequired(amount, 'Amount is required');
  assertRequired(category, 'Category is required');
  assertString(spentAt, 'Spent at must be a string');
  assertString(title, 'Title must be a string');
  assertString(category, 'Category must be a string');

  /** @type {CreateExpenseDto} */
  return {
    userId: Number(userId),
    spentAt,
    title,
    amount: Number(amount),
    category,
    note: String(note),
  };
};

/**
 * @param {{ id?: string }} params
 * @param {Record<string, unknown>} body
 * @returns {{ id: number, payload: PatchExpenseDto }}
 */
const parsePatchExpenseInput = (params, body) => {
  const id = parseIdParam(params.id);

  /** @type {PatchExpenseDto} */
  const payload = {
    title: body.title === undefined ? undefined : String(body.title),
    amount: body.amount === undefined ? undefined : Number(body.amount),
    category: body.category === undefined ? undefined : String(body.category),
    note: body.note === undefined ? undefined : String(body.note),
    spentAt: body.spentAt
      ? new Date(String(body.spentAt)).toISOString()
      : undefined,
  };

  return { id, payload };
};

/**
 * @param {{ id?: string }} params
 * @returns {number}
 */
const parseExpenseIdParam = (params) => parseIdParam(params.id);

module.exports = {
  parseExpenseFilters,
  parseCreateExpenseBody,
  parsePatchExpenseInput,
  parseExpenseIdParam,
};
