const express = require('express');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Inquiry = require('../models/Inquiry');
const Faculty = require('../models/Faculty');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalFaculty,
      totalNotices,
      totalGallery,
      totalCertificates,
      pendingFees,
      totalRevenue,
      newInquiries
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      Notice.countDocuments({ isActive: true }),
      Gallery.countDocuments({ isActive: true }),
      Certificate.countDocuments(),
      Fee.aggregate([
        { $match: { pendingAmount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$pendingAmount' } } }
      ]),
      Fee.aggregate([
        { $group: { _id: null, total: { $sum: '$paidAmount' } } }
      ]),
      Inquiry.countDocuments({ status: 'New' })
    ]);

    const stats = {
      totalStudents,
      totalCourses,
      totalFaculty,
      totalNotices,
      totalGallery,
      totalCertificates,
      pendingFees: pendingFees[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      newInquiries
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activities
router.get('/recent-activities', auth, async (req, res) => {
  try {
    const [
      recentStudents,
      recentInquiries,
      recentNotices
    ] = await Promise.all([
      Student.find()
        .select('fullName admissionId admissionDate')
        .sort({ admissionDate: -1 })
        .limit(5),
      Inquiry.find()
        .select('name course status createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      Notice.find({ isActive: true })
        .select('title type createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      recentStudents,
      recentInquiries,
      recentNotices
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed initial data (for development)
router.post('/seed', auth, async (req, res) => {
  try {
    // Create default admin if not exists
    const adminExists = await require('../models/Admin').findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new (require('../models/Admin'))({
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });
      await admin.save();
    }

    // Create sample courses
    const courses = [
      { name: 'DCA', code: 'DCA001', description: 'Diploma in Computer Applications', duration: '6 months', fees: 8000, category: 'Basic' },
      { name: 'PGDCA', code: 'PGDCA001', description: 'Post Graduate Diploma in Computer Applications', duration: '12 months', fees: 15000, category: 'Advanced' },
      { name: 'ADCA', code: 'ADCA001', description: 'Advanced Diploma in Computer Applications', duration: '9 months', fees: 12000, category: 'Advanced' },
      { name: 'Tally', code: 'TALLY001', description: 'Tally ERP 9 Certification', duration: '3 months', fees: 5000, category: 'Certification' },
      { name: 'DTP', code: 'DTP001', description: 'Desktop Publishing', duration: '4 months', fees: 6000, category: 'Skill Development' },
      { name: 'Web Development', code: 'WEB001', description: 'Full Stack Web Development', duration: '8 months', fees: 18000, category: 'Advanced' },
      { name: 'Python', code: 'PY001', description: 'Python Programming', duration: '6 months', fees: 10000, category: 'Programming Languages' },
      { name: 'Java', code: 'JAVA001', description: 'Java Programming', duration: '8 months', fees: 14000, category: 'Programming Languages' },
      { name: 'C/C++', code: 'CPP001', description: 'C and C++ Programming', duration: '6 months', fees: 9000, category: 'Programming Languages' },
      { name: 'Graphic Design', code: 'GD001', description: 'Graphic Design with Photoshop & Illustrator', duration: '6 months', fees: 12000, category: 'Skill Development' },
      { name: 'Typing', code: 'TYP001', description: 'English & Hindi Typing', duration: '2 months', fees: 3000, category: 'Basic' },
      { name: 'MS Office', code: 'MSO001', description: 'Microsoft Office Suite', duration: '3 months', fees: 4000, category: 'Basic' }
    ];

    for (const courseData of courses) {
      const existing = await Course.findOne({ code: courseData.code });
      if (!existing) {
        await new Course(courseData).save();
      }
    }

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed' });
  }
});

module.exports = router;