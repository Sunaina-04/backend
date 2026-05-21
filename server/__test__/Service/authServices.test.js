jest.mock('jsonwebtoken');
jest.mock('../../config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn()
}));

const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');

const {
  register,
  login
} = require('../../services/authServices');

describe('authServices', () => {
  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    test('throws when username already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        username: 'shruti'
      });

      await expect(
        register({
          username: 'shruti',
          password: '123'
        })
      ).rejects.toThrow('Username is already taken');
    });

    test('creates a new user with hashed password', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt-value');
      bcrypt.hash.mockResolvedValue('hashed_pw');

      const createdUser = {
        id: 'u1',
        username: 'shruti',
        password: 'hashed_pw',
        role: 'User'
      };

      prisma.user.create.mockResolvedValue(createdUser);

      const result = await register({
        username: 'shruti',
        password: '123'
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'shruti' }
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'salt-value');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'shruti',
          password: 'hashed_pw',
          role: 'User'
        }
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    test('throws when username is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        login('shruti', '123')
      ).rejects.toThrow('Invalid username or password');
    });

    test('throws when password does not match', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        username: 'shruti',
        password: 'hashed_pw'
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        login('shruti', 'wrong-password')
      ).rejects.toThrow('Invalid username or password');
    });

    test('returns the user when credentials are valid', async () => {
      const foundUser = {
        id: 'u1',
        username: 'shruti',
        password: 'hashed_pw',
        role: 'User'
      };

      prisma.user.findUnique.mockResolvedValue(foundUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await login('shruti', '123');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'shruti' }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed_pw');
      expect(result).toEqual(foundUser);
    });
  });
});