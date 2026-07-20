/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const usersService = require('../services/users.service');
const {
  parseCreateUserBody,
  parsePatchUserInput,
  parseUserIdParam,
} = require('../validators/users.validator');

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
const createUser = async (req, res) => {
  const { name } = parseCreateUserBody(req.body);
  const user = await usersService.createUser(name);

  res.status(201).json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  const user = await usersService.getUserById(parseUserIdParam(req.params));

  res.json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  await usersService.deleteUser(parseUserIdParam(req.params));

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchUser = async (req, res) => {
  const { id, name } = parsePatchUserInput(req.params, req.body);
  const user = await usersService.patchUser(id, name);

  res.json(user);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  patchUser,
};
