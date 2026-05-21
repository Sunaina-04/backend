const jwt = require("jsonwebtoken");
// 1. Adjusted path to match your file structure
const User = require("../models/userModel"); 

const authMiddleware = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }
    // 2. Switched from cookies to Header to match common JWT implementations
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // 3. Replaced hardcoded string with your process.env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token or session expired" });
  }
};

module.exports = authMiddleware;