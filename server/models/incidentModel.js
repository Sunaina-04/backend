// 1. IMPORT MONGOOSE: No more manual JSON parsing!
const mongoose = require('mongoose');

// 2. SCHEMA DEFINITION: Mapping your incident fields to MongoDB
const incidentSchema = new mongoose.Schema({
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], // Validates data before it hits the DB
        default: 'Low' 
    },
    resolved: { 
        type: Boolean, 
        default: false // Replaces your 'resolved: false' logic from the JSON version
    }
}, { 
    timestamps: true // Tracks when the incident was reported
});

// 3. EXPORT MODEL: The 'Incident' model will now talk to the 'incidents' collection in Atlas
module.exports = mongoose.model('Incident', incidentSchema);