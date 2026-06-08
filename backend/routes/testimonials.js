const express = require('express');
const { body, validationResult } = require('express-validator');
const { Testimonial } = require('../models/associations');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const items = await Testimonial.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create testimonial
router.post('/', auth, upload.single('image'), [
  body('name').notEmpty().trim(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const item = await Testimonial.create({
      ...req.body,
      image: req.file ? req.file.path : null
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete testimonial
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Testimonial.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    await item.destroy();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
