const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Notice, Admin } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active notices (public)
router.get('/', async (req, res) => {
  try {
    const whereClause = {
      isActive: true,
      [Op.or]: [
        { expiryDate: null },
        { expiryDate: { [Op.gte]: new Date() } }
      ]
    };
    if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const notices = await Notice.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active notices by type (public)
router.get('/type/:type', async (req, res) => {
  try {
    const whereClause = {
      type: req.params.type,
      isActive: true,
      [Op.or]: [
        { expiryDate: null },
        { expiryDate: { [Op.gte]: new Date() } }
      ]
    };
    if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const notices = await Notice.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notices (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const whereClause = {};
    if (req.admin.role === 'branch_admin') {
      whereClause.branch = req.admin.branch;
    } else if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const notices = await Notice.findAll({
      where: whereClause,
      include: [{ model: Admin, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice (admin only)
router.post('/', auth, [
  body('title').notEmpty().trim(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const noticeData = {
      ...req.body,
      createdBy: req.admin.id
    };

    // Branch admin notices are automatically assigned to their branch
    if (req.admin.role === 'branch_admin') {
      noticeData.branch = req.admin.branch;
    }

    const notice = await Notice.create(noticeData);
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notice
router.put('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Branch admins can only update notices in their branch
    if (req.admin.role === 'branch_admin' && notice.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage notices in your branch' });
    }

    await notice.update(req.body);
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Branch admins can only delete notices in their branch
    if (req.admin.role === 'branch_admin' && notice.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage notices in your branch' });
    }

    await notice.destroy();
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
