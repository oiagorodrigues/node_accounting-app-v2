let nextId = 1;

/**
 * @typedef {Object} Expense
 * @property {number} id
 * @property {number} userId
 * @property {string} spentAt
 * @property {string} title
 * @property {number} amount
 * @property {string} category
 * @property {string} note
 */
/** @type {Array<Expense>} */
let expenses = [];

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {Array<string>} params.categories
 * @param {string} params.from
 * @param {string} params.to
 * @returns {Array<Expense>}
 */
const getExpenses = ({
  userId = '',
  categories = [],
  from = '',
  to = '',
} = {}) => {
  if (!userId && !categories.length && !from && !to) {
    return expenses;
  }

  return expenses.filter((expense) => {
    return (
      (!userId || expense.userId === Number(userId)) &&
      (!categories.length || categories.includes(expense.category)) &&
      (!from || expense.spentAt >= from) &&
      (!to || expense.spentAt <= to)
    );
  });
};

/**
 * @param {number} id
 * @returns {Expense | undefined}
 */
const getExpenseById = (id) => {
  const expenseObj = expenses.find((expense) => expense.id === id);

  return expenseObj;
};

/**
 * @param {Object} params
 * @param {number} params.userId
 * @param {string} params.spentAt
 * @param {string} params.title
 * @param {number} params.amount
 * @param {string} params.category
 * @param {string} params.note
 * @returns {Expense}
 */
const createExpense = ({ userId, spentAt, title, amount, category, note }) => {
  const expense = {
    id: nextId++,
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  };

  expenses.push(expense);

  return expense;
};

/**
 * @param {number} id
 * @returns {Expense | undefined}
 */
const deleteExpense = (id) => {
  const expense = getExpenseById(Number(id));

  if (!expense) {
    return;
  }

  return expenses.splice(expenses.indexOf(expense), 1);
};

/**
 * @param {number} id
 * @param {Object} params
 * @param {string} params.title
 * @param {number} params.amount
 * @param {string} params.category
 * @param {string} params.spentAt
 * @param {string} params.note
 * @returns {Expense | undefined}
 */
const patchExpense = (id, { title, amount, category, spentAt, note }) => {
  const expense = getExpenseById(id);

  if (!expense) {
    return;
  }

  const newExpense = {
    ...expense,
    title: title ?? expense.title,
    amount: amount ?? expense.amount,
    category: category ?? expense.category,
    spentAt: spentAt ?? expense.spentAt,
    note: note ?? expense.note,
  };

  expenses.splice(expenses.indexOf(expense), 1, newExpense);

  return newExpense;
};

const resetExpenses = () => {
  expenses = [];
  nextId = 1;
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  deleteExpense,
  patchExpense,
  resetExpenses,
};
