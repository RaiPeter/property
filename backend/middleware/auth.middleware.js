require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/Property.js");
const { findUserById } = require("../db/auth-db.js");

const verifyJWT = async (req, res, next) => {
  let token;

  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('Token from Authorization header:', token);
  }

  // Fallback to cookie if no Authorization header
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
    console.log('Token from cookie:', token);
  }

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    console.log(decodedToken);

    const user = await findUserById(decodedToken.id);
    console.log(user);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res
      .status(500)
      .json({ message: "An error occurred: " + err.message });
  }
};

module.exports = {
  verifyJWT,
};
