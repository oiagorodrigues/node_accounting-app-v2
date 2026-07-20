/**
 * @typedef {Object} ExpenseRow
 * @property {number} id
 * @property {number} user_id
 * @property {string} title
 * @property {string} amount
 * @property {string} category
 * @property {string} spent_at
 * @property {string | null} note
 * @property {Date | string} created_at
 * @property {Date | string} updated_at
 */

/** @typedef {import('../dtos/expense.dto').Expense} Expense */

const ExpenseDtoFieldToColumn = {
  userId: 'user_id',
  title: 'title',
  amount: 'amount',
  category: 'category',
  spentAt: 'spent_at',
  note: 'note',
};

/**
 * @param {ExpenseRow} row
 * @returns {Expense}
 */
const toExpense = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  amount: Number(row.amount),
  category: row.category,
  spentAt: new Date(row.spent_at).toISOString(),
  note: row.note ?? '',
});

module.exports = {
  ExpenseDtoFieldToColumn,
  toExpense,
};
