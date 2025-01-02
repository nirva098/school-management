const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const authController = require('../auth.controller');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

jest.mock('../../models/user.model');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({});
      jwt.sign.mockReturnValue('fakeToken');

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password', role: 'user' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token', 'fakeToken');
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password', role: 'user' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 500 if there is an error during registration', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password', role: 'user' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'Error creating user');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockUser = {
        _id: 'userId',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fakeToken');

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token', 'fakeToken');
    });

    it('should return 401 if email is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 500 if there is an error during login', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'Error during login');
    });
  });
});
