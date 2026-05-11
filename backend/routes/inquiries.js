const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all inquiries
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inquiry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create inquiry (public)
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('course').notEmpty(),
  body('message').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiry = new Inquiry(req.body);
    await inquiry.save();

    // Send confirmation email
    await sendInquiryEmail(inquiry);

    res.status(201).json({ 
      message: 'Inquiry submitted successfully',
      inquiry 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inquiry status (admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['New', 'Contacted', 'Converted', 'Closed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = req.body.status;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send inquiry email function
async function sendInquiryEmail(inquiry) {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: inquiry.email,
    subject: 'Inquiry Received - Ideal Computer Education',
    html: `
      <h2>Thank you for your inquiry!</h2>
      <p>Dear ${inquiry.name},</p>
      <p>We have received your inquiry about our ${inquiry.course} course.</p>
      <p>Our team will contact you soon.</p>
      <p>Best regards,<br>Ideal Computer Education Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;