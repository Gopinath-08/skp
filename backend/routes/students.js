const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Student, Course, Batch, Fee } = require('../models/associations');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const branchCodes = {
  Titlagarh: 'TLG',
  'Khariar Road': 'KHR'
};

const getAdmissionYear = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  return String(date.getFullYear()).slice(-2);
};

const getNextAdmissionId = async (branch, admissionDate) => {
  const branchCode = branchCodes[branch] || branchCodes.Titlagarh;
  const prefix = `ICE${getAdmissionYear(admissionDate)}${branchCode}`;
  const branchStudents = await Student.findAll({
    where: {
      admissionId: {
        [Op.like]: `${prefix}%`
      }
    },
    attributes: ['admissionId']
  });

  const lastNumber = branchStudents.reduce((max, student) => {
    const number = Number(String(student.admissionId || '').replace(prefix, ''));
    return Number.isFinite(number) && number > max ? number : max;
  }, 0);

  return `${prefix}${String(lastNumber + 1).padStart(3, '0')}`;
};

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
  body('branch').isIn(Object.keys(branchCodes)),
  body('parentsName').notEmpty(),
  body('motherName').notEmpty(),
  body('parentNumber').notEmpty(),
  body('studentCategory').notEmpty(),
  body('dob').notEmpty(),
  body('gender').notEmpty(),
  body('mobile').notEmpty(),
  body('email').isEmail(),
  body('aadhaar').notEmpty(),
  body('qualification').notEmpty(),
  body('address').notEmpty(),
  body('state').notEmpty(),
  body('district').notEmpty(),
  body('pinCode').notEmpty(),
  body('courseId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const branch = req.body.branch || 'Titlagarh';
    const admissionId = await getNextAdmissionId(branch, req.body.admissionDate);

    const studentData = {
      ...req.body,
      branch,
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
