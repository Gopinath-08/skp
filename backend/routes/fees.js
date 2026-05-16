const express = require('express');
const { body, validationResult } = require('express-validator');
const { Fee, Student, Course } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all fees
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [
        { model: Student, attributes: ['id', 'fullName', 'admissionId'] },
        { model: Course, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fee record by ID
router.get('/:id', async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id, {
      include: [
        { model: Student, attributes: ['id', 'fullName', 'admissionId', 'mobile', 'email'] },
        { model: Course, attributes: ['id', 'name'] }
      ]
    });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create fee record
router.post('/', auth, [
  body('studentId').notEmpty(),
  body('courseId').notEmpty(),
  body('totalFees').isNumeric(),
  body('paidAmount').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fee record (add payment)
router.put('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    await fee.update(req.body);
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete fee record
router.delete('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    
    await fee.destroy();
    res.json({ message: 'Fee record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
