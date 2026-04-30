const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// 1. The GET route to fetch all incidents
router.get('/', incidentController.getIncidents);

// 2. The POST route to add a new incident
router.post('/', incidentController.addIncident);

module.exports = router;