const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

/**
 * Business Logic for Registering a User
 */
const register = async (userData) => {
    const { username, password } = userData;

    const existingUser = await prisma.user.findUnique({
        where: { username }
    });

    if (existingUser) {
        throw new Error('Username is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role: userData.role || 'User'
        }
    });

    return newUser;
};

/**
 * Business Logic for Logging in
 */
const login = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) {
        throw new Error('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid username or password');
    }

    return user;
};

module.exports = { register, login };