const express = require('express');
const { Student, Course, Fee, Batch, Notice, Admin, Faculty, Inquiry } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

const sumMoney = (rows, field) => rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

const getStats = async () => {
  const [totalStudents, totalCourses, totalBatches, totalFaculty, totalNotices, newInquiries, fees] = await Promise.all([
    Student.count(),
    Course.count({ where: { isActive: true } }),
    Batch.count({ where: { isActive: true } }),
    Faculty.count({ where: { isActive: true } }),
    Notice.count({ where: { isActive: true } }),
    Inquiry.count({ where: { status: 'New' } }),
    Fee.findAll()
  ]);

  return {
    totalStudents,
    totalCourses,
    totalBatches,
    totalFaculty,
    totalNotices,
    newInquiries,
    totalRevenue: sumMoney(fees, 'paidAmount'),
    pendingFees: sumMoney(fees, 'pendingAmount')
  };
};

const getRecentActivities = async () => {
  const [recentStudents, recentInquiries, recentNotices] = await Promise.all([
    Student.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Course, attributes: ['name'] }]
    }),
    Inquiry.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    }),
    Notice.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    })
  ]);

  return { recentStudents, recentInquiries, recentNotices };
};

router.get('/stats', auth, async (req, res) => {
  try {
    res.json(await getStats());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recent-activities', auth, async (req, res) => {
  try {
    res.json(await getRecentActivities());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = await getStats();
    const activities = await getRecentActivities();

    res.json({
      stats,
      ...activities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
