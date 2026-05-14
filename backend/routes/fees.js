const express = require('express');
const { body, validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all fees
router.get('/', auth, async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate('student', 'fullName admissionId')
      .populate('course', 'name')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fees by student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .populate('course', 'name');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student')
      .populate('course');
    
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add installment
router.post('/:id/installment', auth, [
  body('amount').isNumeric().custom(value => value > 0),
  body('dueDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    const { amount, dueDate } = req.body;
    fee.installments.push({
      amount,
      dueDate: new Date(dueDate)
    });

    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark installment as paid
router.put('/:id/installment/:installmentId/pay', auth, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    const installment = fee.installments.id(req.params.installmentId);
    if (!installment) {
      return res.status(404).json({ message: 'Installment not found' });
    }

    installment.status = 'Paid';
    installment.paidDate = new Date();
    installment.receiptNumber = `RCP${Date.now()}`;

    fee.paidAmount += installment.amount;
    await fee.save();

    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fee
router.put('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('student', 'fullName admissionId')
     .populate('course', 'name');

    res.json(updatedFee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
