// const Incident = require('../models/incidentModel');

// const incidentController = {
//   // 1. Send all incidents to the client (Admin View)
//   getIncidents: (req, res) => {
//     try {
//       const incidents = Incident.getAll();
//       res.json(incidents);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to load incidents" });
//     }
//   },

//   // 2. Receive a new incident from the client (User View)
//   addIncident: (req, res) => {
//     try {
//       const { latitude, longitude, description, priority } = req.body;

//       // Basic validation: ensure we have the essential coordinates
//       if (!latitude || !longitude) {
//         return res.status(400).json({ message: "Location coordinates are required" });
//       }

//       const newIncident = Incident.create({
//         latitude,
//         longitude,
//         description,
//         priority
//       });

//       res.status(201).json(newIncident);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to save incident" });
//     }
//   }
// };

// module.exports = incidentController;



const incidentService = require('../services/incidentService');

const incidentController = {
  getIncidents: async (req, res) => {
    try {
      // Just calling the service
      const incidents = await incidentService.getAllIncidents();
      res.status(200).json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Error in Controller: " + error.message });
    }
  },

  addIncident: async (req, res) => {
    try {
      // Controller only handles the Request/Response cycle
      const newIncident = await incidentService.createIncident(req.body);
      res.status(201).json(newIncident);
    } catch (error) {
      // Handle logic errors (like validation) here
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = incidentController;