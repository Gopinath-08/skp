const express = require('express');
const { body, validationResult } = require('express-validator');
const { Faculty, Course } = require('../models/associations');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.findAll({
      where: { isActive: true },
      include: [{ model: Course }],
      order: [['name', 'ASC']]
    });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get faculty by ID
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id, {
      include: [{ model: Course }]
    });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create faculty
router.post('/', auth, upload.single('photo'), [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('designation').notEmpty(),
  body('qualification').notEmpty(),
  body('experience').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = { ...req.body, photo: req.file ? req.file.path : null };
    if (data.subjects && typeof data.subjects === 'string') {
      try { data.subjects = JSON.parse(data.subjects); } catch(e) {}
    }
    
    const faculty = await Faculty.create(data);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update faculty
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const updateData = { ...req.body };
    if (req.file) updateData.photo = req.file.path;
    if (updateData.subjects && typeof updateData.subjects === 'string') {
      try { updateData.subjects = JSON.parse(updateData.subjects); } catch(e) {}
    }

    await faculty.update(updateData);
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete faculty
router.delete('/:id', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    
    await faculty.destroy();
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;