jest.mock('../../config/prisma');

const prisma = require('../../config/prisma');

const {
  createVerifiedIncident
} = require('../../services/verifiedService');

describe('createVerifiedIncident service', () => {

  afterEach(() => jest.clearAllMocks());

  test('should create verified incident', async () => {

    prisma.verifiedIncident.create.mockResolvedValue({
      id: 1,
      title: 'Fire'
    });

    const result = await createVerifiedIncident({
      title: 'Fire',
      description: 'Building fire',
      image: 'fire.png'
    });

    expect(result.title).toBe('Fire');
  });

  test('should throw on prisma failure', async () => {

    prisma.verifiedIncident.create.mockRejectedValue(
      new Error('Database Error')
    );

    await expect(
      createVerifiedIncident({
        title: 'Fire'
      })
    ).rejects.toThrow('Database Error');
  });
});