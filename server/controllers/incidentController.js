const incidentService = require('../services/incidentService');

const emitIncidentUpdate = (req, action, incident) => {
  const io = req.app.get('io');

  if (!io || !incident) {
    return;
  }

  io.to('admin').emit('document-updated', {
    action,
    incident
  });
};

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

  addIncident: async (req, res, next) => {
    try {
      const userId = req.auth?.user?.id || req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: user context missing' });
      }

      if (!req.body?.description || typeof req.body.description !== 'string' || !req.body.description.trim()) {
        return res.status(400).json({ message: 'Description is required.' });
      }

      const newIncident = await incidentService.createIncident(req.body, userId);
      const io = req.app && req.app.get && req.app.get('socketio');
      if (io) {
        io.emit('incidentCreated', newIncident);
      }
      res.status(201).json(newIncident);
    } catch (error) {
      if (error.name === 'IncidentValidationError') {
        return res.status(400).json({ message: error.message });
      }

      if (typeof next === 'function') {
        return next(error);
      }

      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateIncident: async (req, res) => {
    try {
      const updatedIncident = await incidentService.updateIncidentById(req.params.id, req.body);

      if (!updatedIncident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      // Emit real-time update event
      const io = req.app && req.app.get && req.app.get('socketio');
      if (io) {
        io.emit('incidentUpdated', updatedIncident);
      }

      return res.status(200).json(updatedIncident);
    } catch (error) {
      if (error.name === 'IncidentValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = incidentController;