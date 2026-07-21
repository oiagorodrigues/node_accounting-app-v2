/**
 * @typedef {import('../repositories/users.repository').User} User
 */

const { NotFoundError } = require('../errors/app.errors');
const usersRepository = require('../repositories/users.repository');

/**
 * @returns {Promise<User[]>}
 */
const getUsers = async () => {
  return usersRepository.getAll();
};

/**
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * @param {string} name
 * @returns {Promise<User>}
 */
const createUser = async (name) => {
  return usersRepository.create(name);
};

/**
 * @param {string} id
 * @returns {Promise<User>}
 */
const deleteUser = async (id) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await usersRepository.remove(id);

  return user;
};

/**
 * @param {string} id
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const patchUser = async (id, name) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return usersRepository.patch(id, name);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  patchUser,
};
