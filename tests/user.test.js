'use strict';

const supertest = require('supertest');
const { createServer } = require('../src/createServer');

const UNKNOWN_UUID = '00000000-0000-4000-8000-000000000000';

describe('User', () => {
  let server;
  let api;
  let emailSeq;

  beforeEach(() => {
    server = createServer();
    api = supertest(server);
    emailSeq = 0;
  });

  /**
   * @param {Record<string, unknown>} [overrides]
   */
  const registerUser = (overrides = {}) => {
    emailSeq += 1;

    return api.post('/auth/register').send({
      name: 'John Doe',
      email: `user${emailSeq}@example.com`,
      password: 'secret123',
      ...overrides,
    });
  };

  describe('createUser', () => {
    it('should create a new user', async () => {
      const name = 'John Doe';

      const response = await registerUser({ name })
        .expect(201)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name,
          email: 'user1@example.com',
        }),
      );
    });

    it('should return 400 if name is not provided', async () => {
      await api.post('/auth/register').send({}).expect(400);
    });
  });

  describe('getUsers', () => {
    it('should return empty array if no users', async () => {
      const response = await api
        .get('/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual([]);
    });

    it('should return all users', async () => {
      const users = [
        {
          name: 'John Doe',
        },
        {
          name: 'Jane Doe',
        },
      ];

      const createdUsers = [];

      for (const user of users) {
        const res = await registerUser(user)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        createdUsers.push(res.body);
      }

      const response = await api
        .get('/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual(expect.arrayContaining(createdUsers));
    });
  });

  describe('getUser', () => {
    it('should return 404 if user does not exist', async () => {
      await api.get(`/users/${UNKNOWN_UUID}`).expect(404);
    });

    it('should return user', async () => {
      const name = 'John Doe';

      const createdUser = await registerUser({ name });

      const response = await api
        .get(`/users/${createdUser.body.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createdUser.body.id,
          name,
        }),
      );
    });
  });

  describe('updateUser', () => {
    it('should return 404 if user does not exist', async () => {
      await api
        .patch(`/users/${UNKNOWN_UUID}`)
        .send({
          name: 'John Doe',
          email: 'missing@example.com',
          password: 'secret123',
        })
        .expect(404);
    });

    it('should update user', async () => {
      const name = 'John Doe';

      const createdUser = await registerUser({ name });

      const newName = 'Jane Doe';
      const email = 'jane@example.com';
      const password = 'newsecret123';

      const response = await api
        .patch(`/users/${createdUser.body.id}`)
        .send({
          name: newName,
          email,
          password,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createdUser.body.id,
          name: newName,
          email,
        }),
      );
    });
  });

  describe('deleteUser', () => {
    it('should return 404 if user does not exist', async () => {
      await api.delete(`/users/${UNKNOWN_UUID}`).expect(404);
    });

    it('should delete user', async () => {
      const name = 'John Doe';

      const createdUser = await registerUser({ name });

      await api.delete(`/users/${createdUser.body.id}`).expect(204);

      await api.get(`/users/${createdUser.body.id}`).expect(404);
    });
  });
});
