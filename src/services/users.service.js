/**
 * @typedef {import('../repositories/users.repository').User} User
 */

const usersRepository = require('../repositories/users.repository');

/**
 * @returns {Promise<User[]>}
 */
const getUsers = async () => {
  const users = await usersRepository.getAll();

  return users;
};

/**
 * @param {number} id
 * @returns {Promise<User | undefined>}
 */
const getUserById = async (id) => {
  const user = await usersRepository.getById(id);

  return user;
};

/**
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const createUser = async (name) => {
  const user = await usersRepository.create(name);

  return user;
};

/**
 * @param {number} id
 * @returns {Promise<User | undefined>}
 */
const deleteUser = async (id) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    return;
  }

  const removedUser = await usersRepository.remove(id);

  return removedUser;
};

/**
 * @param {number} id
 * @param {string} name
 * @returns {Promise<User | undefined>}
 */
const patchUser = async (id, name) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    return;
  }

  const newUser = await usersRepository.patch(id, name);

  return newUser;
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  patchUser,
};
