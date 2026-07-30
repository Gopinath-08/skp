const express = require('express');
const { body, validationResult } = require('express-validator');
const { Certificate, Student, Course } = require('../models/associations');
const auth = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const whereClause = {};
    if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const certificates = await Certificate.findAll({
      where: whereClause,
      include: [
        { model: Student, attributes: ['id', 'fullName', 'admissionId', 'branch'] },
        { model: Course, attributes: ['id', 'name'] }
      ],
      order: [['issueDate', 'DESC']]
    });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify certificate by ID/number
router.get('/verify/:certId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      where: { certificateNumber: req.params.certId },
      include: [
        { model: Student, attributes: ['id', 'fullName', 'admissionId'] },
        { model: Course, attributes: ['id', 'name'] }
      ]
    });
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new certificate
router.post('/', auth, [
  body('studentId').notEmpty(),
  body('courseId').notEmpty(),
  body('grade').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const student = await Student.findByPk(req.body.studentId);

    // Branch admins can only create certificates for students in their branch
    if (req.admin.role === 'branch_admin' && student && student.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only generate certificates for students in your branch' });
    }

    const certificateNumber = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const cert = await Certificate.create({
      ...req.body,
      certificateNumber,
      branch: student ? student.branch : req.body.branch
    });

    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete certificate
router.delete('/:id', auth, async (req, res) => {
  try {
    const cert = await Certificate.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Not found' });

    // Branch admins can only delete certificates in their branch
    if (req.admin.role === 'branch_admin' && cert.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage certificates in your branch' });
    }

    await cert.destroy();
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
