jest.mock('../../services/authServices', () => ({
  register: jest.fn(),
  login: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

const jwt = require('jsonwebtoken');
const authService = require('../../services/authServices');

const {
  registerUser,
  loginUser,
  logoutUser,
  getSessionUser
} = require('../../controllers/authController');

const mockRes = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);

  return res;
};

describe('authController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('registerUser', () => {
    test('responds with 201 and the created user', async () => {
      authService.register.mockResolvedValue({
        id: 'u1',
        username: 'shruti',
        role: 'User'
      });

      const req = {
        body: {
          username: 'shruti',
          password: '123456'
        }
      };
      const res = mockRes();

      await registerUser(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully!',
        user: {
          username: 'shruti',
          role: 'User'
        }
      });
    });

    test('responds with 400 when registration fails', async () => {
      authService.register.mockRejectedValue(new Error('Username is already taken'));

      const req = { body: { username: 'shruti', password: '123456' } };
      const res = mockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username is already taken'
      });
    });
  });

  describe('loginUser', () => {
    test('responds with 200, session data, and token on success', async () => {
      authService.login.mockResolvedValue({
        id: 'u1',
        username: 'shruti',
        role: 'User'
      });
      jwt.sign.mockReturnValue('jwt_token');

      const req = {
        body: {
          username: 'shruti',
          password: '123'
        },
        session: {}
      };
      const res = mockRes();

      await loginUser(req, res);

      expect(authService.login).toHaveBeenCalledWith('shruti', '123');
      expect(req.session.user).toEqual({
        id: 'u1',
        username: 'shruti',
        role: 'User'
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 'u1',
          username: 'shruti',
          role: 'User'
        },
        'incident-reporting-jwt-secret',
        { expiresIn: '1d' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        role: 'User',
        username: 'shruti',
        token: 'jwt_token'
      });
    });

    test('responds with 401 when credentials are invalid', async () => {
      authService.login.mockRejectedValue(new Error('Invalid username or password'));

      const req = {
        body: {
          username: 'wrong',
          password: 'bad'
        },
        session: {}
      };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid username or password'
      });
    });
  });

  describe('logoutUser', () => {
    test('clears the session cookie on successful logout', () => {
      const req = {
        session: {
          destroy: jest.fn((callback) => callback())
        }
      };
      const res = mockRes();

      logoutUser(req, res);

      expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
      expect(res.clearCookie).toHaveBeenCalledWith('incident.sid');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successful'
      });
    });

    test('responds with 500 when logout fails', () => {
      const req = {
        session: {
          destroy: jest.fn((callback) => callback(new Error('destroy failed')))
        }
      };
      const res = mockRes();

      logoutUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to logout'
      });
    });
  });

  describe('getSessionUser', () => {
    test('returns 401 when no active session exists', () => {
      const req = {
        session: {},
        headers: {}
      };
      const res = mockRes();

      getSessionUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No active session'
      });
    });

    test('returns session user data when a session is active', () => {
      const req = {
        session: {
          user: {
            id: 'u1',
            username: 'shruti',
            role: 'User'
          }
        },
        headers: {
          cookie: 'incident.sid=abc'
        }
      };
      const res = mockRes();

      getSessionUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Session active',
        user: {
          id: 'u1',
          username: 'shruti',
          role: 'User'
        },
        cookiePresent: true
      });
    });
  });
});