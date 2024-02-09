// userController.js
const User = require("../Model/UserModel");

// Get all users
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

// Other user-related controllers (e.g., createUser, getUserById, etc.)
