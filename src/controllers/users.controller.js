/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 *
 * @typedef {import('../dtos/user.dto').User} User
 */

const usersService = require('../services/users.service');
const {
  parseUserIdParam,
  parsePatchUserInput,
} = require('../validators/users.validator');
const { assertValid } = require('../validators/common.validator');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getUsers = async (req, res) => {
  const users = await usersService.getUsers();

  res.json(users);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getAllActiveUsers = async (req, res) => {
  const users = await usersService.getAllActive();

  res.json(users);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  const id = assertValid(parseUserIdParam(req.params));
  const user = await usersService.getUserById(id);

  res.json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  const id = assertValid(parseUserIdParam(req.params));

  await usersService.deleteUser(id);

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchUser = async (req, res) => {
  const { id, ...payload } = assertValid(
    parsePatchUserInput(req.params, req.body),
  );
  const user = await usersService.patchUser(id, payload);

  res.json(user);
};

module.exports = {
  getUsers,
  getAllActiveUsers,
  getUserById,
  deleteUser,
  patchUser,
};
