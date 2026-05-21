const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const requireAuth = require('../middleware/requireAuth');
router.get('/', requireAuth, incidentController.getIncidents);

router.post('/', requireAuth, incidentController.addIncident);

router.put('/:id', requireAuth, incidentController.updateIncident);

module.exports = router;