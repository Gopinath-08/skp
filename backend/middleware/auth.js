const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || decoded.email?.toLowerCase() !== adminEmail.toLowerCase()) {
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
