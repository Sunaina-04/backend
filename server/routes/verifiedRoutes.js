const express = require('express');
const multer = require('multer');
const upload = require('../middleware/upload');
const verifiedController = require('../controllers/verifiedController');

const router = express.Router();

router.post('/', upload.single('imageUrl'), verifiedController.createVerifiedIncident);
router.get('/', verifiedController.getVerifiedIncidents);

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
