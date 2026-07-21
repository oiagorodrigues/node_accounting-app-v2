'use strict';

/**
 * @typedef {import('../dtos/auth.dto').AuthLoginDto} AuthLoginDto
 */

const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

const usersService = require('../services/users.service');
const authService = require('../services/auth.service');

const tokensRepository = require('../repositories/tokens.repository');

const {
  parseAuthRegisterBody,
  parseAuthActivateParams,
  parseAuthLoginBody,
} = require('../validators/auth.validator');
const { assertValid } = require('../validators/common.validator');

const mailer = require('../utils/mailer');

/**
 * @param {import('express').Response} res
 * @param {AuthLoginDto} userData
 * @returns {Promise<void>}
 */
const _sendAuthentication = async (res, userData) => {
  const accessToken = jwt.generateAccessToken(userData);
  const refreshToken = jwt.generateRefreshToken(userData);

  // delete the old token for the user
  await tokensRepository.deleteByUserId(userData.id);

  // create the new token for the user
  await tokensRepository.create(userData.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({
    user: userData,
    accessToken,
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
  const payload = assertValid(parseAuthRegisterBody(req.body));

  // since the token will be removed after activation,
  // we can generate a simple string instead of a hash
  const activationToken = bcrypt.genSaltSync(1);

  const user = await usersService.createUser({ ...payload, activationToken });

  await mailer.sendActivationLink(user.email, activationToken);

  res.status(201).json(user);
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const activate = async (req, res) => {
  const payload = assertValid(parseAuthActivateParams(req.params));
  const user = await authService.activate(payload);

  await mailer.sendAccountActivatedEmail(user.email);

  res.status(200).json({
    user,
    accessToken: jwt.generateAccessToken(user),
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
  const payload = assertValid(parseAuthLoginBody(req.body));
  const user = await authService.login(payload);

  await _sendAuthentication(res, user);
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || '';

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || '';
  const user = await authService.refresh(refreshToken);

  await _sendAuthentication(res, user);
};

module.exports = {
  register,
  activate,
  login,
  logout,
  refresh,
};
