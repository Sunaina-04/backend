const Incident = require('../models/incidentModel'); // Now points to the Mongoose Model

/**
 * Business Logic for creating an incident
 */
const createIncident = async (incidentData) => {
    // Logic: Auto-assigning priority based on keywords
    if (incidentData.description && incidentData.description.includes("Emergency")) {
        incidentData.priority = "High";
    }

    // UPDATED: Using Mongoose .create() instead of manual JSON push
    // Mongoose will automatically add the unique _id and timestamps
    const newIncident = await Incident.create(incidentData);
    return newIncident;
};

/**
 * Fetch all incidents
 */
const getAllIncidents = async () => {
    // UPDATED: Using Mongoose .find() instead of reading a .json file
    return await Incident.find().sort({ createdAt: -1 }); // Optional: sort by newest first
};

module.exports = {
    createIncident,
    getAllIncidents
};