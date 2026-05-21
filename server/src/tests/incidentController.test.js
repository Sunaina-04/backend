const express = require('express');
const request = require('supertest');

jest.mock('../../services/incidentService', () => ({
    createIncident: jest.fn(),
    getAllIncidents: jest.fn(),
    updateIncidentById: jest.fn()
}));

const incidentService = require('../../services/incidentService');
const incidentController = require('../../controllers/incidentController');

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        req.auth = { user: { id: 'user-1' } };
        next();
    });

    app.post('/incidents', (req, res, next) => incidentController.addIncident(req, res, next));
    app.use((err, req, res, next) => {
        res.status(500).json({ message: 'Internal Server Error' });
    });

    return app;
};

describe('incidentController', () => {
    let app;

    beforeEach(() => {
        app = buildApp();
        jest.clearAllMocks();
    });

    test('returns 201 and calls the service on success', async () => {
        // Arrange
        incidentService.createIncident.mockResolvedValue({
            id: 'incident-1',
            description: 'Road block',
            latitude: 12.3,
            longitude: 45.6
        });

        const payload = {
            latitude: '12.3',
            longitude: '45.6',
            description: 'Road block',
            priority: 'Low'
        };

        // Act
        const response = await request(app)
            .post('/incidents')
            .send(payload)
            .send(payload);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: 'incident-1',
            description: 'Road block',
            latitude: 12.3,
            longitude: 45.6
        });
        expect(incidentService.createIncident).toHaveBeenCalledWith(payload, 'user-1');
    });

    test('returns 400 when required description is missing without invoking service', async () => {
        // Arrange
        const payload = {
            latitude: '12.3',
            longitude: '45.6',
            priority: 'Low'
        };

        // Act
        const response = await request(app)
            .post('/incidents')
            .send(payload);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Description is required.' });
        expect(incidentService.createIncident).not.toHaveBeenCalled();
    });

    test('returns 500 when the service throws an unexpected error', async () => {
        // Arrange
        incidentService.createIncident.mockRejectedValue(new Error('Database timeout'));

        const payload = {
            latitude: '12.3',
            longitude: '45.6',
            description: 'Road block',
            priority: 'Low'
        };

        // Act
        const response = await request(app)
            .post('/incidents')
            .send(payload);

        // Assert
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
        expect(incidentService.createIncident).toHaveBeenCalledWith(payload, 'user-1');
    });
});