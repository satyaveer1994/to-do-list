const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//const taskController = require('../controllers/taskController');

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decodedToken = jwt.verify(token, "your-secret-key");
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Error authenticating token", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
