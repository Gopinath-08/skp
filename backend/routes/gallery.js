const express = require('express');
const { body, validationResult } = require('express-validator');
const { Gallery, Admin } = require('../models/associations');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { extractFilePath } = require('../utils/fileUpload');

const router = express.Router();
const galleryCategories = ['Campus', 'Events', 'Students', 'Faculty', 'Achievements', 'Infrastructure'];

const applyGalleryDefaults = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = 'Campus';
  }
  next();
};

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const whereClause = { isActive: true };
    if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const items = await Gallery.findAll({
      where: whereClause,
      order: [['uploadedAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image (admin only)
router.post('/', auth, upload.single('image'), applyGalleryDefaults, [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('category').isIn(galleryCategories).withMessage('Category is invalid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    let tags = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()) : req.body.tags;
    }

    const itemData = {
      ...req.body,
      image: extractFilePath(req.file),
      tags,
      uploadedBy: req.admin.id
    };

    // Branch admin gallery items are automatically assigned to their branch
    if (req.admin.role === 'branch_admin') {
      itemData.branch = req.admin.branch;
    }

    const item = await Gallery.create(itemData);
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

    // Branch admins can only update gallery items in their branch
    if (req.admin.role === 'branch_admin' && item.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage gallery items in your branch' });
    }

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

    // Branch admins can only delete gallery items in their branch
    if (req.admin.role === 'branch_admin' && item.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage gallery items in your branch' });
    }

    await item.destroy();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
