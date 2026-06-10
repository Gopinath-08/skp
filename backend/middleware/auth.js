const jwt = require('jsonwebtoken');

const getRequiredEnv = (name) => process.env[name]?.trim();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = getRequiredEnv('JWT_SECRET');
    const adminEmail = getRequiredEnv('ADMIN_EMAIL');

    if (!jwtSecret || !adminEmail) {
      return res.status(500).json({ message: 'Admin authentication is not configured' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.admin = {
      id: decoded.id || 'env-admin',
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
