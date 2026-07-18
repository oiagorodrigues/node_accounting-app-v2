'use strict';

const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users.route');

const usersService = require('./services/users.service');

function createServer() {
  usersService.resetUsers();

  // Use express to create a server
  // Add a routes to the server
  // Return the server (express app)
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/users', usersRoutes);

  return app;
}

module.exports = {
  createServer,
};
