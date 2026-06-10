const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

const getEnvAdmin = () => ({
  id: 'env-admin',
  name: process.env.ADMIN_NAME || 'Admin',
  email: process.env.ADMIN_EMAIL
});

// Login
router.post('/login', [
  body('email').isEmail().trim().toLowerCase(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin login is not configured' });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = getEnvAdmin();
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
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
