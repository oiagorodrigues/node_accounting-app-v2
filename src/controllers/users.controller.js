/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const usersService = require('../services/users.service');

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
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });

    return;
  }

  if (typeof name !== 'string') {
    res.status(400).json({ error: 'Name must be a string' });

    return;
  }

  const user = await usersService.createUser(name);

  if (!user) {
    res.status(404).json({ error: 'User not found' });

    return;
  }

  res.status(201).json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  const user = await usersService.getUserById(Number(id));

  if (!user) {
    res.status(404).json({ error: 'User not found' });

    return;
  }

  res.json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  const user = await usersService.deleteUser(Number(id));

  if (!user) {
    res.status(404).json({ error: 'User not found' });

    return;
  }

  res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const patchUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    res.status(400).json({ error: 'ID is required' });

    return;
  }

  if (!name) {
    res.status(400).json({ error: 'Name is required' });

    return;
  }

  if (typeof name !== 'string') {
    res.status(400).json({ error: 'Name must be a string' });

    return;
  }

  const user = await usersService.patchUser(Number(id), name);

  if (!user) {
    res.status(404).json({ error: 'User not found' });

    return;
  }

  res.json(user);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  patchUser,
};
