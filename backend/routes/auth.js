const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

const getRequiredEnv = (name) => process.env[name]?.trim();
const getAdminUserId = () => getRequiredEnv('ADMIN_USER_ID') || getRequiredEnv('ADMIN_EMAIL');

const getEnvAdmin = () => ({
  id: 'env-admin',
  name: process.env.ADMIN_NAME || 'Admin',
  email: getAdminUserId(),
  userId: getAdminUserId()
});

// Login
router.post('/login', [
  body('email').trim().notEmpty().withMessage('User ID is required'),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const adminUserId = getAdminUserId();
    const adminPassword = getRequiredEnv('ADMIN_PASSWORD');
    const jwtSecret = getRequiredEnv('JWT_SECRET');

    if (!adminUserId || !adminPassword || !jwtSecret) {
      return res.status(500).json({
        message: 'Admin login is not configured',
        missing: [
          !adminUserId && 'ADMIN_USER_ID',
          !adminPassword && 'ADMIN_PASSWORD',
          !jwtSecret && 'JWT_SECRET'
        ].filter(Boolean)
      });
    }

    if (email.trim().toLowerCase() !== adminUserId.toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = getEnvAdmin();
    const token = jwt.sign({ id: admin.id, userId: admin.userId }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin
router.get('/me', auth, async (req, res) => {
  res.json({
    admin: {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email
    }
  });
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  res.status(403).json({ message: 'Admin password can only be changed in environment variables' });
});

module.exports = router;
