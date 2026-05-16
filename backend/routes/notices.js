const express = require('express');
const { body, validationResult } = require('express-validator');
const { Notice, Admin } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active notices (public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { isActive: true },
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
    const notices = await Notice.findAll({
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

    const notice = await Notice.create({
      ...req.body,
      createdBy: req.admin.id
    });
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

    await notice.destroy();
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
