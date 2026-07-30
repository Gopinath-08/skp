const jwt = require('jsonwebtoken');
const { Admin } = require('../models/associations');

const getRequiredEnv = (name) => process.env[name]?.trim();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = getRequiredEnv('JWT_SECRET');
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Authentication is not configured' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.admin = {
      id: decoded.id || null,
      userId: decoded.userId || decoded.email,
      name: decoded.name || 'Admin',
      email: decoded.email || decoded.userId,
      role: decoded.role || 'superadmin',
      branch: decoded.branch || null
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
