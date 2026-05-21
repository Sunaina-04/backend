const { mockDeep, mockReset } = require('jest-mock-extended');

const mockPrisma = mockDeep();

jest.mock('../../config/prisma', () => mockPrisma);

const incidentService = require('../../services/incidentService');

describe('incidentService', () => {
    beforeEach(() => {
        mockReset(mockPrisma);
    });

    describe('createIncident', () => {
        test('creates a low-priority incident and calls prisma.incident.create with parsed data', async () => {
            // Arrange
            const userId = 'user-123';
            const incidentData = {
                latitude: '12.345',
                longitude: '67.89',
                description: 'Routine incident report',
                priority: 'Low',
                resolved: 'false'
            };

            mockPrisma.incident.create.mockResolvedValue({
                id: 'incident-1',
                latitude: 12.345,
                longitude: 67.89,
                description: 'Routine incident report',
                priority: 'Low',
                resolved: false,
                userId
            });

            // Act
            const result = await incidentService.createIncident(incidentData, userId);

            // Assert
            expect(mockPrisma.incident.create).toHaveBeenCalledWith({
                data: {
                    latitude: 12.345,
                    longitude: 67.89,
                    description: 'Routine incident report',
                    priority: 'Low',
                    resolved: false,
                    userId
                }
            });
            expect(result).toEqual({
                id: 'incident-1',
                latitude: 12.345,
                longitude: 67.89,
                description: 'Routine incident report',
                priority: 'Low',
                resolved: false,
                userId
            });
        });

        test('throws before prisma is called when description contains banned content', async () => {
            // Arrange
            const userId = 'user-123';
            const incidentData = {
                latitude: '12.345',
                longitude: '67.89',
                description: 'This contains banned content',
                priority: 'Low',
                resolved: 'false'
            };

            // Act
            const result = incidentService.createIncident(incidentData, userId);

            // Assert
            await expect(result).rejects.toThrow('Incident description contains banned content.');
            expect(mockPrisma.incident.create).not.toHaveBeenCalled();
        });

        test('throws before prisma is called when coordinates are invalid', async () => {
            // Arrange
            const userId = 'user-123';
            const incidentData = {
                latitude: 'not-a-number',
                longitude: '67.89',
                description: 'Routine incident report',
                priority: 'Low',
                resolved: 'false'
            };

            // Act
            const result = incidentService.createIncident(incidentData, userId);

            // Assert
            await expect(result).rejects.toThrow('Invalid incident coordinates.');
            expect(mockPrisma.incident.create).not.toHaveBeenCalled();
        });
    });
});