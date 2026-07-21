/**
 * @typedef {Object} UserRow
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string | null} activation_token
 */

/** @typedef {import('../dtos/user.dto').User} User */

const UserDtoFieldToColumn = {
  name: 'name',
  email: 'email',
  password: 'password',
};

/**
 * @param {UserRow} user
 * @returns {User}
 */
const toUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.password,
  activationToken: user.activation_token ?? undefined,
});

module.exports = {
  UserDtoFieldToColumn,
  toUser,
};
