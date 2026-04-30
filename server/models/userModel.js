const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

const userModel = {
    // 1. Get all users from the file
    getAllUsers: async () => {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    },

    // 2. Add a new user to the file
    saveUser: async (newUser) => {
        try {
            const users = await userModel.getAllUsers();
            users.push(newUser);
            await fs.writeFile(filePath, JSON.stringify(users, null, 2));
            return true;
        } catch (error) {
            console.error("Error saving user:", error);
            return false;
        }
    }
};

module.exports = userModel;