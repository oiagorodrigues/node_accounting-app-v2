'use strict';

const { db } = require('./src/utils/db');

beforeEach(async () => {
  await db.query('TRUNCATE expenses, users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await db.end();
});
