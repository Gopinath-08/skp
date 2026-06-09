const express = require('express');
const { body, validationResult } = require('express-validator');
const { Gallery, Admin } = require('../models/associations');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { extractFilePath } = require('../utils/fileUpload');

const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.findAll({
      where: { isActive: true },
      order: [['uploadedAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image (admin only)
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().trim(),
  body('category').isIn(['Campus', 'Events', 'Students', 'Faculty', 'Achievements', 'Infrastructure'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    let tags = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()) : req.body.tags;
    }

    const item = await Gallery.create({
      ...req.body,
      image: extractFilePath(req.file),
      tags,
      uploadedBy: req.admin.id
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gallery item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const updateData = { ...req.body };
    if (req.file) updateData.image = extractFilePath(req.file);
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    await item.update(updateData);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    await item.destroy();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
