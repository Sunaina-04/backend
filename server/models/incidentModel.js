const fs = require('fs');
const path = require('path');

const incidentsPath = path.join(__dirname, '../data/incidents.json');

const Incident = {
  // Get all incidents
  getAll: () => {
    const data = fs.readFileSync(incidentsPath, 'utf8');
    return JSON.parse(data);
  },

  // Add a new incident
  create: (newIncident) => {
    const incidents = Incident.getAll();

    // Create a new object with a unique ID
    const incidentToAdd = {
      id: Date.now(), // Simple way to get a unique ID
      ...newIncident,
      resolved: false
    };

    incidents.push(incidentToAdd);
    
    // Save it back to the file
    fs.writeFileSync(incidentsPath, JSON.stringify(incidents, null, 2));
    return incidentToAdd;
  }
};

module.exports = Incident;