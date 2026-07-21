const { Router } = require('express');
const cookieParser = require('cookie-parser');

const authController = require('../controllers/auth.controller');

const authRouter = Router();

authRouter.post('/registration', authController.register);
authRouter.get('/activation/:email/:token', authController.activate);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh', cookieParser(), authController.refresh);

module.exports = authRouter;
