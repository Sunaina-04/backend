const authService = require('../services/authServices');

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
        // Service verifies credentials and returns user details
        const user = await authService.login(username, password);

        res.status(200).json({
            message: "Login successful",
            role: user.role,
            username: user.username
        });
    } catch (error) {
        // 401 Unauthorized for failed login
        res.status(401).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };