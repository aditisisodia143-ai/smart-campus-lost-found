const jwt = require("jsonwebtoken");

function requireStudent(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded; // { id, name, email, contact, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Your session expired, please log in again" });
  }
}

module.exports = requireStudent;