const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/active', authMiddleware, usersController.getAllActiveUsers);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.delete('/:id', usersController.deleteUser);
usersRouter.patch('/:id', usersController.patchUser);

module.exports = usersRouter;
