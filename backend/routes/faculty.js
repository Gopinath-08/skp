const express = require('express');
const { body, validationResult } = require('express-validator');
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ name: 1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get faculty by ID
router.get('/:id', async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(facultyMember);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create faculty (admin only)
router.post('/', auth, upload.single('photo'), [
  body('name').notEmpty().trim(),
  body('designation').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('qualification').notEmpty(),
  body('experience').notEmpty(),
  body('subjects').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const facultyData = {
      ...req.body,
      photo: req.file ? req.file.path : null
    };

    const faculty = new Faculty(facultyData);
    await faculty.save();

    res.status(201).json(faculty);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update faculty (admin only)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.photo = req.file.path;

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete faculty (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;