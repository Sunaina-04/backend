const fs = require('fs');
const prisma = require('../../config/prisma');
const { uploadImage } = require('../../utils/cloudinary');

const allowedPriorities = new Set(['Low', 'Medium', 'High']);

const parseFloatField = (value, fieldName) => {
  const parsedValue = parseFloat(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  return parsedValue;
};

const createVerifiedIncident = async (req, res) => {
  const uploadedFilePath = req.file?.path;

  try {
    const latitude = parseFloatField(req.body.latitude, 'Latitude');
    const longitude = parseFloatField(req.body.longitude, 'Longitude');
    const description = req.body.description?.trim();
    const priority = req.body.priority ? req.body.priority.trim() : 'Medium';
    const userId = req.body.userId || null;

    if (!description) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    if (!allowedPriorities.has(priority)) {
      return res.status(400).json({
        message: 'Priority must be one of: Low, Medium, High.'
      });
    }

    if (!uploadedFilePath) {
      return res.status(400).json({ message: 'An image file is required.' });
    }

    const imageUrl = await uploadImage(uploadedFilePath);

    const verifiedIncident = await prisma.verifiedIncident.create({
      data: {
        latitude,
        longitude,
        description,
        priority,
        imageUrl,
        userId
      }
    });

    return res.status(201).json({
      message: 'Verified incident saved successfully.',
      data: verifiedIncident
    });
  } catch (error) {
    if (error.message.includes('must be a valid number') || error.message.includes('required')) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: 'Failed to upload the file or save the incident.',
      error: error.message
    });
  } finally {
    // Security rule 3: guarantee local cleanup even if Cloudinary or Prisma fails.
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        // Best-effort cleanup only; do not crash the server during file removal.
      }
    }
  }
};

const getVerifiedIncidents = async (req, res) => {
  try {
    const incidents = await prisma.verifiedIncident.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(incidents);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve verified incidents.',
      error: error.message
    });
  }
};

module.exports = {
  createVerifiedIncident,
  getVerifiedIncidents
};