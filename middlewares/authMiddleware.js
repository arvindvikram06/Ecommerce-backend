const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

 
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.adminMiddleware = (req, res, next) => {
 
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
