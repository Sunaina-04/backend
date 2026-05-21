const fs = require('fs');
const prisma = require('../config/prisma');
const { uploadImage } = require('../utils/cloudinary');

const allowedPriorities = new Set(['Low', 'Medium', 'High']);

const parseFloatField = (value, fieldName) => {
    const parsedValue = parseFloat(value);

    if (Number.isNaN(parsedValue)) {
        throw new Error(`${fieldName} must be a valid number.`);
    }

    return parsedValue;
};

// Multer stores the multipart file locally first.
// This controller uploads req.file.path to Cloudinary, then persists the returned URL in PostgreSQL.
exports.createVerifiedIncident = async (req, res) => {
    const uploadedFilePath = req.file?.path;

    try {
        const latitude = parseFloatField(req.body.latitude, 'Latitude');
        const longitude = parseFloatField(req.body.longitude, 'Longitude');
        const { description, priority, userId } = req.body;
        const normalizedPriority = priority ? priority.trim() : 'Medium';

        if (!description || !description.trim()) {
            return res.status(400).json({ message: 'Description is required.' });
        }

        if (!allowedPriorities.has(normalizedPriority)) {
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
                description: description.trim(),
                priority: normalizedPriority,
                imageUrl,
                userId: userId || null
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
            message: 'Failed to upload media or save the verified incident.',
            error: error.message
        });
    } finally {
        if (uploadedFilePath) {
            fs.promises.unlink(uploadedFilePath).catch(() => {
                // Best-effort cleanup only.
            });
        }
    }
};

exports.getVerifiedIncidents = async (req, res) => {
    try {
        const incidents = await prisma.verifiedIncident.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json(incidents);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve verified incidents.',
            error: error.message
        });
    }
};