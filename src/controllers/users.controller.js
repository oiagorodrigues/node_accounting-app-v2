const usersService = require('../services/users.service');

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getUsers = (req, res) => {
  const users = usersService.getUsers();

  res.json(users);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const createUser = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }

  const user = usersService.createUser(name);

  res.status(201).json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const getUserById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const user = usersService.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const user = usersService.deleteUser(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.sendStatus(204);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const patchUser = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }

  const user = usersService.patchUser(id, name);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
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
