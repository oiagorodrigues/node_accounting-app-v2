const { AuthorizationError } = require('../errors/app.errors');
const jwt = require('../utils/jwt');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const [, accessToken] = authHeader.split(' ');

  if (!authHeader || !authHeader.startsWith('Bearer') || !accessToken) {
    throw new AuthorizationError('Token is required');
  }

  const userData = jwt.validateAccessToken(accessToken);

  if (!userData) {
    throw new AuthorizationError('Invalid token');
  }

  next();
};

module.exports = authMiddleware;
