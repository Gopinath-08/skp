const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Admin } = require('../models/associations');
const auth = require('../middleware/auth');
const { normalizeBranch, validBranches } = require('../config/branches');

const router = express.Router();

const getRequiredEnv = (name) => process.env[name]?.trim();

// Login (supports both superadmin via env and branch admin via DB)
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
    const jwtSecret = getRequiredEnv('JWT_SECRET');

    if (!jwtSecret) {
      return res.status(500).json({ message: 'Login is not configured' });
    }

    // Try superadmin login (env-based)
    const adminUserId = getRequiredEnv('ADMIN_USER_ID') || getRequiredEnv('ADMIN_EMAIL');
    const adminPassword = getRequiredEnv('ADMIN_PASSWORD');

    if (adminUserId && adminPassword &&
        email.trim().toLowerCase() === adminUserId.toLowerCase() &&
        password === adminPassword) {
      const token = jwt.sign(
        { id: null, userId: adminUserId, name: process.env.ADMIN_NAME || 'System Director', role: 'superadmin', branch: null },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      return res.json({
        token,
        admin: { id: null, name: process.env.ADMIN_NAME || 'System Director', email: adminUserId, role: 'superadmin', branch: null }
      });
    }

    // Try branch admin login (DB-based)
    const branchAdmin = await Admin.findOne({ where: { email: email.trim().toLowerCase() } });
    if (branchAdmin && (await branchAdmin.comparePassword(password))) {
      const token = jwt.sign(
        { id: branchAdmin.id, userId: branchAdmin.email, name: branchAdmin.name, role: 'branch_admin', branch: branchAdmin.branch },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      return res.json({
        token,
        admin: { id: branchAdmin.id, name: branchAdmin.name, email: branchAdmin.email, role: 'branch_admin', branch: branchAdmin.branch }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin
router.get('/me', auth, async (req, res) => {
  res.json({ admin: req.admin });
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  const { role, id } = req.admin;
  if (role === 'superadmin') {
    return res.status(403).json({ message: 'Superadmin password can only be changed in environment variables' });
  }
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    admin.password = req.body.password;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
