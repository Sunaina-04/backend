const express = require('express');
const multer = require('multer');
const upload = require('../middlewares/upload');
const verifiedIncidentController = require('../controllers/verifiedIncidentController');

const router = express.Router();

// Security rule 3: exactly one file is accepted, and the field name is imageUrl.
router.post('/', upload.single('imageUrl'), verifiedIncidentController.createVerifiedIncident);
router.get('/', verifiedIncidentController.getVerifiedIncidents);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size allowed is 5MB.' });
    }

    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err) {
    return res.status(400).json({ message: err.message || 'Invalid file upload.' });
  }

  return next();
});

module.exports = router;