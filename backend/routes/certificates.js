const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');
const Student = require('../models/Student');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all certificates
router.get('/', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('student', 'fullName admissionId')
      .populate('course', 'name')
      .sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student')
      .populate('course');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify certificate
router.get('/verify/:certificateNumber', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateNumber: req.params.certificateNumber 
    })
    .populate('student', 'fullName admissionId')
    .populate('course', 'name');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.student.fullName,
      courseName: certificate.course.name,
      issueDate: certificate.issueDate,
      grade: certificate.grade,
      isVerified: certificate.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate certificate
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, courseId, grade } = req.body;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or course not found' });
    }

    // Generate certificate number
    const count = await Certificate.countDocuments();
    const certificateNumber = `ICE-CERT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    const certificate = new Certificate({
      student: studentId,
      course: courseId,
      certificateNumber,
      grade: grade || 'Pass'
    });

    await certificate.save();

    // Generate PDF
    const pdfPath = await generateCertificatePDF(certificate, student, course);
    certificate.pdfPath = pdfPath;
    await certificate.save();

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download certificate PDF
router.get('/:id/download', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate || !certificate.pdfPath) {
      return res.status(404).json({ message: 'Certificate PDF not found' });
    }

    res.download(certificate.pdfPath);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate PDF function
async function generateCertificatePDF(certificate, student, course) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    const fileName = `certificate-${certificate.certificateNumber}.pdf`;
    const filePath = path.join(__dirname, '../uploads', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Certificate design
    doc.fontSize(30).text('CERTIFICATE OF COMPLETION', 0, 150, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(24).text(student.fullName.toUpperCase(), { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(course.name.toUpperCase(), { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`with grade: ${certificate.grade}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' });
    doc.text(`Issue Date: ${certificate.issueDate.toDateString()}`, { align: 'center' });

    // Signature area
    doc.moveDown(3);
    doc.fontSize(12).text('Authorized Signature', 600, 350);

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = router;