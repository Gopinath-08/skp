const express = require('express');
const { Student, Fee, Course, Batch } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate Reports
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Course, attributes: ['name'] },
        { model: Batch, attributes: ['name'] }
      ]
    });
    
    const fees = await Fee.findAll({
      include: [
        { model: Student, attributes: ['fullName'] }
      ]
    });

    res.json({
      studentsReport: students,
      feesReport: fees,
      message: 'Use frontend to export as PDF/Excel based on this data'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
