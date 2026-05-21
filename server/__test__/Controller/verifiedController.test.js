jest.mock('../../config/prisma');

const prisma = require('../../config/prisma');

const {
  createVerifiedIncident
} = require('../../controllers/verifiedController');

const mockRes = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe('createVerifiedIncident Controller', () => {

  afterEach(() => jest.clearAllMocks());

  test('should create verified incident', async () => {

    prisma.verifiedIncident.create.mockResolvedValue({
      id: 1,
      title: 'Fire'
    });

    const req = {
      body: {
        title: 'Fire',
        description: 'Major fire'
      },
      file: {
        filename: 'fire.png'
      }
    };

    const res = mockRes();

    await createVerifiedIncident(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('should handle prisma error', async () => {

    prisma.verifiedIncident.create.mockRejectedValue(
      new Error('DB Error')
    );

    const req = {
      body: {},
      file: {}
    };

    const res = mockRes();

    await createVerifiedIncident(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});