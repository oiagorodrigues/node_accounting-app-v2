'use strict';

// eslint-disable-next-line no-shadow
const { expect } = require('expect');
const { db } = require('./src/utils/db');

function mochaGlobalSetup() {
  global.expect = expect;
}

const mochaHooks = {
  beforeEach: async () => {
    await db.query('TRUNCATE expenses, users RESTART IDENTITY CASCADE');
  },

  afterAll: async () => {
    await db.end();
  },
};

module.exports = {
  mochaGlobalSetup,
  mochaHooks,
};
