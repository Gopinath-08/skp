const express = require('express');
const { body, validationResult } = require('express-validator');
const { Student, Course, Batch, Fee } = require('../models/associations');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Course, attributes: ['id', 'name'] },
        { model: Batch, attributes: ['id', 'name', 'timing'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Course },
        { model: Batch },
        { model: Fee }
      ]
    });
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
  body('fullName').notEmpty(),
  body('parentsName').notEmpty(),
  body('dob').notEmpty(),
  body('gender').notEmpty(),
  body('mobile').notEmpty(),
  body('email').isEmail(),
  body('aadhaar').notEmpty(),
  body('qualification').notEmpty(),
  body('address').notEmpty(),
  body('courseId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lastStudent = await Student.findOne({ order: [['id', 'DESC']] });
    const lastId = lastStudent ? parseInt(lastStudent.admissionId.replace('ICE', '')) : 0;
    const admissionId = `ICE${(lastId + 1).toString().padStart(4, '0')}`;

    const studentData = {
      ...req.body,
      admissionId,
      photo: req.files?.photo ? req.files.photo[0].path : null,
      signature: req.files?.signature ? req.files.signature[0].path : null
    };

    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', auth, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updateData = { ...req.body };
    if (req.files?.photo) updateData.photo = req.files.photo[0].path;
    if (req.files?.signature) updateData.signature = req.files.signature[0].path;

    await student.update(updateData);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
