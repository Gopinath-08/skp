const jwt = require('jsonwebtoken');

const getRequiredEnv = (name) => process.env[name]?.trim();
const getAdminUserId = () => getRequiredEnv('ADMIN_USER_ID') || getRequiredEnv('ADMIN_EMAIL');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = getRequiredEnv('JWT_SECRET');
    const adminUserId = getAdminUserId();

    if (!jwtSecret || !adminUserId) {
      return res.status(500).json({ message: 'Admin authentication is not configured' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const tokenUserId = decoded.userId || decoded.email;

    if (tokenUserId?.toLowerCase() !== adminUserId.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const parsedAdminId = Number.parseInt(decoded.id, 10);
    const adminId = Number.isInteger(parsedAdminId) ? parsedAdminId : null;

    req.admin = {
      id: adminId,
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminUserId,
      userId: adminUserId
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
