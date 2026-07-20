let nextId = 1;

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 */
/** @type {Array<User>} */
let users = [];

/**
 * @returns {Array<User>}
 */
const getUsers = () => {
  return users;
};

/**
 * @param {number} id
 * @returns {User | undefined}
 */
const getUserById = (id) => {
  const userObj = users.find((user) => user.id === Number(id));

  return userObj;
};

/**
 * @param {string} name
 * @returns {User}
 */
const createUser = (name) => {
  const user = { id: nextId++, name };

  users.push(user);

  return user;
};

/**
 * @param {number} id
 * @returns {User | undefined}
 */
const deleteUser = (id) => {
  const user = getUserById(id);

  if (!user) {
    return;
  }

  return users.splice(users.indexOf(user), 1);
};

/**
 * @param {number} id
 * @param {string} name
 * @returns {User | undefined}
 */
const patchUser = (id, name) => {
  const user = getUserById(id);

  if (!user) {
    return;
  }

  const newUser = { ...user, name };

  users.splice(users.indexOf(user), 1, newUser);

  return newUser;
};

const resetUsers = () => {
  users = [];
  nextId = 1;
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  patchUser,
  resetUsers,
};
