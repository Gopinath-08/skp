const express = require('express');
const { body, validationResult } = require('express-validator');
const { Course, Faculty, Batch } = require('../models/associations');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
      include: [
        { model: Faculty, attributes: ['id', 'name'] },
        { model: Batch, attributes: ['id', 'name', 'timing', 'schedule'] }
      ]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Faculty, attributes: ['id', 'name'] },
        { model: Batch, attributes: ['id', 'name', 'timing', 'schedule'] }
      ]
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course (admin only)
router.post('/', auth, upload.single('image'), [
  body('name').notEmpty().trim(),
  body('code').notEmpty().trim(),
  body('description').notEmpty(),
  body('duration').notEmpty(),
  body('fees').isNumeric(),
  body('category').isIn(['Basic', 'Advanced', 'Certification', 'Skill Development'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const courseData = {
      ...req.body,
      image: req.file ? req.file.path : null
    };

    if (courseData.syllabus && typeof courseData.syllabus === 'string') {
      try {
        courseData.syllabus = JSON.parse(courseData.syllabus);
      } catch(e) {}
    }

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Course code already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;
    
    if (updateData.syllabus && typeof updateData.syllabus === 'string') {
      try {
        updateData.syllabus = JSON.parse(updateData.syllabus);
      } catch(e) {}
    }

    await course.update(updateData);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
