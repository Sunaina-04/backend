jest.mock('../../models/incidentModel');

const Incident = require('../../models/incidentModel');

const {
  createIncident,
  getAllIncidents
} = require('../../services/incidentService');

// ---------------- CREATE INCIDENT ----------------

describe('createIncident service', () => {

  afterEach(() => jest.clearAllMocks());

  test('should assign High priority automatically', async () => {

    const fakeIncident = {
      _id: 'i1',
      description: 'Emergency near highway',
      priority: 'High'
    };

    Incident.create.mockResolvedValue(fakeIncident);

    const result = await createIncident({
      latitude: 30.7,
      longitude: 76.7,
      description: 'Emergency near highway'
    });

    expect(result.priority).toBe('High');
  });

  test('should create normal incident', async () => {

    const fakeIncident = {
      _id: 'i2',
      description: 'Street light issue',
      priority: 'Low'
    };

    Incident.create.mockResolvedValue(fakeIncident);

    const result = await createIncident({
      latitude: 30.7,
      longitude: 76.7,
      description: 'Street light issue'
    });

    expect(result.priority).toBe('Low');
  });
});

// ---------------- FETCH INCIDENTS ----------------

describe('getAllIncidents service', () => {

  afterEach(() => jest.clearAllMocks());

  test('should return all incidents', async () => {

    const incidents = [
      { _id: '1' },
      { _id: '2' }
    ];

    Incident.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(incidents)
    });

    const result = await getAllIncidents();

    expect(result.length).toBe(2);
  });
});