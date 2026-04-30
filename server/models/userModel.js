// 1. IMPORT MONGOOSE: We no longer need 'fs' or 'path' because we aren't reading files
const mongoose = require('mongoose');

// 2. SCHEMA DEFINITION: This acts as the blueprint for your data
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true // MONGODB UPDATE: This automatically prevents duplicate usernames
    },
    password: { 
        type: String, 
        required: true // This will store the BCRYPT HASH, not the plain text
    },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], // ENFORCEMENT: Only allows these specific strings
        default: 'User' 
    }
}, { 
    timestamps: true // NEW: Automatically adds 'createdAt' and 'updatedAt' fields
});

// 3. EXPORT MODEL: This provides the .findOne(), .create(), etc. methods to your services
module.exports = mongoose.model('User', userSchema);