const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Student, Course, Batch, Fee } = require('../models/associations');
const auth = require('../middleware/auth');
const { profileUpload } = require('../middleware/upload');
const { handleStudentProfileUpload } = require('../utils/fileUpload');
const { branchCodes, validBranches, normalizeBranch } = require('../config/branches');

const router = express.Router();

const validStudentCategories = ['SC', 'ST', 'General', 'OBC'];

const getAdmissionYear = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  return String(date.getFullYear()).slice(-2);
};

const getNextAdmissionId = async (branch, admissionDate) => {
  const normalizedBranch = normalizeBranch(branch);
  const branchCode = branchCodes[normalizedBranch] || branchCodes.Titilagarh;
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
    const whereClause = {};
    if (req.query.branch) {
      whereClause.branch = normalizeBranch(req.query.branch);
    }
    const students = await Student.findAll({
      where: whereClause,
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
router.post('/', auth, profileUpload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'tenthCertificate', maxCount: 1 },
  { name: 'twelfthCertificate', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'certificate1', maxCount: 1 },
  { name: 'certificate2', maxCount: 1 },
  { name: 'certificate3', maxCount: 1 }
]), [
  body('fullName').notEmpty(),
  body('branch').customSanitizer(normalizeBranch).isIn(validBranches),
  body('parentsName').notEmpty(),
  body('motherName').notEmpty(),
  body('parentNumber').notEmpty(),
  body('studentCategory').isIn(validStudentCategories),
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

    const branch = normalizeBranch(req.body.branch) || 'Titilagarh';

    // Branch admins can only create students in their branch
    if (req.admin.role === 'branch_admin' && branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only add students to your branch' });
    }

    const admissionId = await getNextAdmissionId(branch, req.body.admissionDate);

    const fileUpdates = handleStudentProfileUpload(req);

    const studentData = {
      ...req.body,
      branch,
      admissionId,
      photo: fileUpdates.photo || null,
      tenthCertificate: fileUpdates.tenthCertificate || null,
      twelfthCertificate: fileUpdates.twelfthCertificate || null,
      aadhaarCard: fileUpdates.aadhaarCard || null,
      certificate1: fileUpdates.certificate1 || null,
      certificate2: fileUpdates.certificate2 || null,
      certificate3: fileUpdates.certificate3 || null
    };

    const student = await Student.create(studentData);
    res.status(201).json({
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Student creation error:', error.message);
    res.status(500).json({
      message: 'Error creating student',
      error: error.message
    });
  }
});

// Update student
router.put('/:id', auth, profileUpload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'tenthCertificate', maxCount: 1 },
  { name: 'twelfthCertificate', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'certificate1', maxCount: 1 },
  { name: 'certificate2', maxCount: 1 },
  { name: 'certificate3', maxCount: 1 }
]), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Branch admins can only update students in their branch
    if (req.admin.role === 'branch_admin' && student.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only update students in your branch' });
    }

    const updateData = { ...req.body };
    if (updateData.branch) {
      updateData.branch = normalizeBranch(updateData.branch);
      if (!validBranches.includes(updateData.branch)) {
        return res.status(400).json({ message: 'Invalid branch' });
      }
    }
    if (updateData.studentCategory && !validStudentCategories.includes(updateData.studentCategory)) {
      return res.status(400).json({ message: 'Invalid student category' });
    }

    const fileUpdates = handleStudentProfileUpload(req);
    if (fileUpdates.photo) updateData.photo = fileUpdates.photo;
    if (fileUpdates.tenthCertificate) updateData.tenthCertificate = fileUpdates.tenthCertificate;
    if (fileUpdates.twelfthCertificate) updateData.twelfthCertificate = fileUpdates.twelfthCertificate;
    if (fileUpdates.aadhaarCard) updateData.aadhaarCard = fileUpdates.aadhaarCard;
    if (fileUpdates.certificate1) updateData.certificate1 = fileUpdates.certificate1;
    if (fileUpdates.certificate2) updateData.certificate2 = fileUpdates.certificate2;
    if (fileUpdates.certificate3) updateData.certificate3 = fileUpdates.certificate3;

    await student.update(updateData);
    res.json({
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Student update error:', error);
    res.status(500).json({
      message: 'Error updating student',
      error: error.message
    });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Branch admins can only delete students in their branch
    if (req.admin.role === 'branch_admin' && student.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only delete students in your branch' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
