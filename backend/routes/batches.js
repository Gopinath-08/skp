const express = require('express');
const { body, validationResult } = require('express-validator');
const { Batch, Course, Faculty, Student } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.findAll({
      where: { isActive: true },
      include: [
        { model: Course, attributes: ['id', 'name'] },
        { model: Faculty, attributes: ['id', 'name'] },
        { model: Student, attributes: ['id', 'fullName'] }
      ]
    });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id, {
      include: [
        { model: Course, attributes: ['id', 'name'] },
        { model: Faculty, attributes: ['id', 'name'] },
        { model: Student, attributes: ['id', 'fullName'] }
      ]
    });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create batch
router.post('/', auth, [
  body('name').notEmpty(),
  body('schedule').notEmpty(),
  body('timing').notEmpty(),
  body('courseId').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update batch
router.put('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await batch.update(req.body);
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete batch
router.delete('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await batch.destroy();
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
