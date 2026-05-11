const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find()
      .populate('course', 'name code')
      .sort({ admissionDate: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('course', 'name code fees')
      .populate('fees');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student
router.post('/', auth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), [
  body('fullName').notEmpty().trim(),
  body('parentsName').notEmpty().trim(),
  body('dob').isISO8601(),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('mobile').isMobilePhone(),
  body('email').isEmail().normalizeEmail(),
  body('aadhaar').isLength({ min: 12, max: 12 }),
  body('qualification').notEmpty(),
  body('address').notEmpty(),
  body('course').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(400).json({ message: 'Invalid course' });
    }

    // Generate admission ID
    const count = await Student.countDocuments();
    const admissionId = `ICE${new Date().getFullYear()}${(count + 1).toString().padStart(4, '0')}`;

    const studentData = {
      ...req.body,
      admissionId,
      photo: req.files.photo ? req.files.photo[0].path : null,
      signature: req.files.signature ? req.files.signature[0].path : null
    };

    const student = new Student(studentData);
    await student.save();

    // Create fee record
    const fee = new Fee({
      student: student._id,
      course: course._id,
      totalFees: course.fees
    });
    await fee.save();

    // Update student with fee reference
    student.fees.push(fee._id);
    await student.save();

    res.status(201).json({ student, admissionId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Admission ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', auth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updateData = { ...req.body };
    if (req.files.photo) updateData.photo = req.files.photo[0].path;
    if (req.files.signature) updateData.signature = req.files.signature[0].path;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('course', 'name code');

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify student
router.get('/verify/:admissionId', async (req, res) => {
  try {
    const student = await Student.findOne({ admissionId: req.params.admissionId })
      .populate('course', 'name')
      .select('fullName admissionId course status admissionDate');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;