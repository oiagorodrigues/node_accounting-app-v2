'use strict';

jest.mock('./src/utils/mailer', () => ({
  send: jest.fn().mockResolvedValue({}),
  sendActivationLink: jest.fn().mockResolvedValue({}),
  sendAccountActivatedEmail: jest.fn().mockResolvedValue({}),
}));

const { db } = require('./src/utils/db');

beforeEach(async () => {
  await db.query('TRUNCATE expenses, tokens, users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await db.end();
});
