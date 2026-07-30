const express = require('express');
const { Student, Fee, Course, Batch } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate Reports
router.get('/', auth, async (req, res) => {
  try {
    const studentWhere = {};
    if (req.admin.role === 'branch_admin') {
      studentWhere.branch = req.admin.branch;
    } else if (req.query.branch) {
      studentWhere.branch = req.query.branch;
    }

    const feeWhere = {};
    if (req.admin.role === 'branch_admin') {
      feeWhere.branch = req.admin.branch;
    } else if (req.query.branch) {
      feeWhere.branch = req.query.branch;
    }

    const students = await Student.findAll({
      where: studentWhere,
      include: [
        { model: Course, attributes: ['name'] },
        { model: Batch, attributes: ['name'] }
      ]
    });

    const fees = await Fee.findAll({
      where: feeWhere,
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
