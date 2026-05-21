const prisma = require('../config/prisma');

class IncidentValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IncidentValidationError';
    }
}

const toIncidentPayload = (incidentDoc) => incidentDoc;

/**
 * Business Logic for creating an incident
 */
const createIncident = async (incidentData, userId) => {
    const latitude = parseFloat(incidentData.latitude);
    const longitude = parseFloat(incidentData.longitude);
    const description = incidentData.description;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new IncidentValidationError('Invalid incident coordinates.');
    }

    if (!description || typeof description !== 'string') {
        throw new IncidentValidationError('Incident description is required.');
    }

    const flaggedWords = ['banned', 'malicious', 'exploit'];
    const containsFlaggedWord = flaggedWords.some((word) => description.toLowerCase().includes(word));

    if (containsFlaggedWord) {
        throw new IncidentValidationError('Incident description contains banned content.');
    }

    const payload = {
        latitude,
        longitude,
        description,
        priority: incidentData.priority || 'Low',
        resolved: typeof incidentData.resolved === 'boolean' ? incidentData.resolved : incidentData.resolved === 'true',
        userId
    };

    if (payload.description && payload.description.includes('Emergency')) {
        payload.priority = 'High';
    }

    const newIncident = await prisma.incident.create({
        data: payload
    });

    return toIncidentPayload(newIncident);
};

/**
 * Fetch all incidents
 */
const getAllIncidents = async () => {
    const incidents = await prisma.incident.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return incidents.map((incident) => toIncidentPayload(incident));
};

/**
 * Update incident by MongoDB _id
 */
const updateIncidentById = async (id, updateData) => {
    const allowedFields = ['description', 'priority', 'resolved', 'latitude', 'longitude'];
    const safeUpdate = {};

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(updateData, field)) {
            safeUpdate[field] = updateData[field];
        }
    });

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'latitude')) {
        safeUpdate.latitude = parseFloat(safeUpdate.latitude);
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'longitude')) {
        safeUpdate.longitude = parseFloat(safeUpdate.longitude);
    }

    if (Object.prototype.hasOwnProperty.call(safeUpdate, 'resolved') && typeof safeUpdate.resolved !== 'boolean') {
        safeUpdate.resolved = safeUpdate.resolved === 'true';
    }

    const updatedIncident = await prisma.incident.update({
        where: { id },
        data: safeUpdate
    });

    return toIncidentPayload(updatedIncident);
};

module.exports = {
    createIncident,
    getAllIncidents,
    updateIncidentById,
    IncidentValidationError
};