/**
 * @typedef {import('../repositories/users.repository').User} User
 * @typedef {import('../dtos/user.dto').CreateUserDto} CreateUserDto
 * @typedef {import('../dtos/user.dto').PatchUserDto} PatchUserDto
 */

const bcrypt = require('bcrypt');

const {
  NotFoundError,
  UnprocessableEntityError,
} = require('../errors/app.errors');
const usersRepository = require('../repositories/users.repository');

/**
 * @returns {Promise<User[]>}
 */
const getUsers = async () => {
  return usersRepository.getAll();
};

/**
 * @returns {Promise<User[]>}
 */
const getAllActive = async () => {
  return usersRepository.getAllActive();
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
 * @param {CreateUserDto} payload
 * @returns {Promise<User>}
 */
const createUser = async ({ name, email, password, activationToken }) => {
  const existingUser = await usersRepository.getByEmail(email);

  if (existingUser) {
    throw new UnprocessableEntityError('Email is already taken');
  }

  // saltRounds adds time to password hashing, making attacks harder.
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await usersRepository.create({
    name,
    email,
    password: hashedPassword,
    activationToken,
  });

  return user;
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
 * @param {PatchUserDto} payload
 * @returns {Promise<User | undefined>}
 */
const patchUser = async (id, payload) => {
  const user = await usersRepository.getById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return usersRepository.patch(id, payload);
};

module.exports = {
  getUsers,
  getAllActive,
  getUserById,
  deleteUser,
  patchUser,
  createUser,
};
