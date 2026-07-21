'use strict';

const { Router } = require('express');
const usersController = require('../controllers/users.controller');

const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/', usersController.createUser);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.delete('/:id', usersController.deleteUser);
usersRouter.patch('/:id', usersController.patchUser);

module.exports = usersRouter;
