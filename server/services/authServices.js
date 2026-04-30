const mongoose = require('mongoose');
require('../models/userModel');
const User = mongoose.models.User || mongoose.model('User');
const bcrypt = require('bcryptjs');

/**
 * Business Logic for Registering a User
 */
const register = async (userData) => {
    const { username, password } = userData;

    // 1. UPDATED: Using Mongoose .findOne() instead of old JSON array search
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
        throw new Error('Username is already taken');
    }

    // 2. Security: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. UPDATED: Using Mongoose .create() instead of old .saveUser()
    const newUser = await User.create({
        username,
        password: hashedPassword,
        role: userData.role || 'User' 
    });

    return newUser;
};

/**
 * Business Logic for Logging in
 */
const login = async (username, password) => {
    // 1. UPDATED: Find user in MongoDB
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid username or password');
    }

    // 2. Compare Bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid username or password');
    }

    return user;
};

module.exports = { register, login };