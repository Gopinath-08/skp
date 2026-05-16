const express = require('express');
const { Student, Course, Fee, Batch, Notice, Admin, Faculty } = require('../models/associations');
const auth = require('../middleware/auth');
const sequelize = require('../config/database');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const activeCourses = await Course.count({ where: { isActive: true } });
    const totalBatches = await Batch.count({ where: { isActive: true } });
    const totalFaculty = await Faculty.count({ where: { isActive: true } });
    
    // Fees collected and pending
    const fees = await Fee.findAll();
    const feesCollected = fees.reduce((sum, fee) => sum + parseFloat(fee.paidAmount || 0), 0);
    const pendingFees = fees.reduce((sum, fee) => sum + parseFloat(fee.pendingAmount || 0), 0);

    // Recent admissions
    const recentAdmissions = await Student.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Course, attributes: ['name'] }]
    });

    // Recent notices
    const recentNotices = await Notice.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      stats: {
        totalStudents,
        activeCourses,
        totalBatches,
        totalFaculty,
        feesCollected,
        pendingFees
      },
      recentAdmissions,
      recentNotices
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;