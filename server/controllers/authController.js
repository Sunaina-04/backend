const authService = require('../services/authServices');
const jwt = require('jsonwebtoken');

// Handler for Registration
const registerUser = async (req, res) => {
    try {
        // Send data to service; wait for it to finish hashing and saving
        const newUser = await authService.register(req.body);
        
        res.status(201).json({ 
            message: "User registered successfully!", 
            user: { username: newUser.username, role: newUser.role } 
        });
    } catch (error) {
        // Catch errors like "User already exists" thrown by the service
        res.status(400).json({ message: error.message });
    }
};

// Handler for Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.login(username, password);

        req.session.user = {
            id: String(user.id),
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(
            {
                id: String(user.id),
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET || 'incident-reporting-jwt-secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            role: user.role,
            username: user.username,
            token
        });
    } catch (error) {
        // 401 Unauthorized for failed login
        res.status(401).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }

        res.clearCookie('incident.sid');
        return res.status(200).json({ message: 'Logout successful' });
    });
};

const getSessionUser = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No active session' });
    }

    return res.status(200).json({
        message: 'Session active',
        user: req.session.user,
        cookiePresent: Boolean(req.headers.cookie)
    });
};

module.exports = { registerUser, loginUser, logoutUser, getSessionUser };