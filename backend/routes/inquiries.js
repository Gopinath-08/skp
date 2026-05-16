const express = require('express');
const { body, validationResult } = require('express-validator');
const { Inquiry } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all inquiries (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create inquiry (public)
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty(),
  body('course').notEmpty(),
  body('message').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inquiry status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    await inquiry.update({ status: req.body.status });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    await inquiry.destroy();
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;