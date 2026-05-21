jest.mock('../../services/incidentService');

const {
  createIncident,
  getAllIncidents
} = require('../../services/incidentService');

const {
  addIncident,
  fetchIncidents
} = require('../../controllers/incidentController');

const mockRes = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

// ---------------- ADD INCIDENT ----------------

describe('addIncident Controller', () => {

  afterEach(() => jest.clearAllMocks());

  test('should create incident successfully', async () => {

    const fakeIncident = {
      _id: 'i1',
      description: 'Emergency near highway',
      priority: 'High'
    };

    createIncident.mockResolvedValue(fakeIncident);

    const req = {
      body: {
        latitude: 30.7,
        longitude: 76.7,
        description: 'Emergency near highway'
      },
      user: {
        id: 'u1'
      }
    };

    const res = mockRes();

    await addIncident(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        priority: 'High'
      })
    );
  });

  test('should handle incident creation failure', async () => {

    createIncident.mockRejectedValue(
      new Error('Failed to create incident')
    );

    const req = { body: {} };

    const res = mockRes();

    await addIncident(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------- FETCH INCIDENTS ----------------

describe('fetchIncidents Controller', () => {

  afterEach(() => jest.clearAllMocks());

  test('should fetch all incidents', async () => {

    getAllIncidents.mockResolvedValue([
      { _id: '1' },
      { _id: '2' }
    ]);

    const req = {};

    const res = mockRes();

    await fetchIncidents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();
  });
});