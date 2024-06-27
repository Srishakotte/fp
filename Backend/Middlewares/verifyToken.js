const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).send({ message: "Unauthorized access. Please login to continue." });
  }

  const token = bearerToken.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid or expired token. Please login again." });
  }
}

module.exports = verifyToken;
