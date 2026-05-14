const express = require('express');
const { body, validationResult } = require('express-validator');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const gallery = await Gallery.find(query)
      .populate('uploadedBy', 'name')
      .sort({ uploadedAt: -1 });
    
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gallery categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gallery item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id)
      .populate('uploadedBy', 'name');
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create gallery item (admin only)
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().trim(),
  body('category').isIn(['Campus', 'Events', 'Students', 'Faculty', 'Achievements', 'Infrastructure'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const galleryData = {
      ...req.body,
      image: req.file.path,
      uploadedBy: req.admin._id
    };

    const galleryItem = new Gallery(galleryData);
    await galleryItem.save();

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gallery item (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('uploadedBy', 'name');

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
