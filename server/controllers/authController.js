const userModel = require('../models/userModel');

// Handler for Registration
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await userModel.getAllUsers();
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Create user object with a default role
        const newUser = { username, password, role: 'User' };
        await userModel.saveUser(newUser);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Handler for Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await userModel.getAllUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Send back the role so the Frontend knows where to redirect
        res.status(200).json({
            message: "Login successful",
            role: user.role,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { registerUser, loginUser };