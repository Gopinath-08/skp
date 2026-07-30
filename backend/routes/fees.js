const express = require('express');
const { body, validationResult } = require('express-validator');
const { Fee, Student, Course } = require('../models/associations');
const auth = require('../middleware/auth');
const { getBranchFilter, setBranchIfNeeded } = require('../utils/branchFilter');

const router = express.Router();

const toNumber = (value) => Number(value || 0);
const roundMoney = (value) => Math.round(toNumber(value) * 100) / 100;
const buildReceiptNumber = () => `RCP${Date.now()}`;

const feeIncludes = [
  { model: Student, attributes: ['id', 'fullName', 'admissionId', 'mobile', 'email', 'branch'] },
  { model: Course, attributes: ['id', 'name', 'fees'] }
];

const getFeeWithDetails = (id) => Fee.findByPk(id, { include: feeIncludes });

const validatePaymentTotals = ({ totalFees, paidAmount, discount }) => {
  const total = roundMoney(totalFees);
  const paid = roundMoney(paidAmount);
  const concession = roundMoney(discount);

  if (total < 0 || paid < 0 || concession < 0) {
    return 'Fee, paid amount, and discount cannot be negative';
  }
  if (paid + concession > total) {
    return 'Paid amount and discount cannot be greater than total fees';
  }
  return null;
};

// Get all fees
router.get('/', async (req, res) => {
  try {
    const whereClause = {};
    if (req.query.branch) {
      whereClause.branch = req.query.branch;
    }
    const fees = await Fee.findAll({
      where: whereClause,
      include: feeIncludes,
      order: [['createdAt', 'DESC']]
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fee records for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const fees = await Fee.findAll({
      where: { studentId: req.params.studentId },
      include: feeIncludes,
      order: [['createdAt', 'DESC']]
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fee record by ID
router.get('/:id', async (req, res) => {
  try {
    const fee = await getFeeWithDetails(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create fee record
router.post('/', auth, [
  body('studentId').notEmpty(),
  body('courseId').notEmpty(),
  body('totalFees').isNumeric(),
  body('paidAmount').optional().isNumeric(),
  body('discount').optional().isNumeric(),
  body('admissionFees').optional().isNumeric(),
  body('courseFees').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const student = await Student.findByPk(req.body.studentId);
    if (!student) return res.status(400).json({ message: 'Selected student does not exist' });

    // Branch admins can only create fees for students in their branch
    if (req.admin.role === 'branch_admin' && student.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage fees for students in your branch' });
    }

    const course = await Course.findByPk(req.body.courseId);
    if (!course) return res.status(400).json({ message: 'Selected course does not exist' });

    const admissionFees = roundMoney(req.body.admissionFees);
    const courseFees = roundMoney(req.body.courseFees || req.body.totalFees);
    const totalFees = roundMoney(req.body.totalFees || admissionFees + courseFees);
    const paidAmount = roundMoney(req.body.paidAmount);
    const discount = roundMoney(req.body.discount);
    const totalError = validatePaymentTotals({ totalFees, paidAmount, discount });
    if (totalError) return res.status(400).json({ message: totalError });

    const installments = paidAmount > 0 ? [{
      amount: paidAmount,
      paymentMethod: req.body.paymentMethod || 'Cash',
      paymentType: req.body.paymentType || 'Installment',
      paidDate: req.body.paidDate || new Date(),
      receiptNumber: req.body.receiptNumber || buildReceiptNumber(),
      note: 'Opening payment'
    }] : [];

    const feeData = {
      ...req.body,
      branch: student.branch,
      totalFees,
      paidAmount,
      discount,
      admissionFees,
      courseFees,
      installments,
    };

    const fee = await Fee.create(feeData);
    res.status(201).json(await getFeeWithDetails(fee.id));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update fee record
router.put('/:id', auth, [
  body('totalFees').optional().isNumeric(),
  body('paidAmount').optional().isNumeric(),
  body('discount').optional().isNumeric(),
  body('admissionFees').optional().isNumeric(),
  body('courseFees').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    // Branch admins can only update fees in their branch
    if (req.admin.role === 'branch_admin' && fee.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage fees in your branch' });
    }

    const admissionFees = roundMoney(req.body.admissionFees ?? fee.admissionFees);
    const courseFees = roundMoney(req.body.courseFees ?? fee.courseFees);
    const totalFees = roundMoney(req.body.totalFees ?? (admissionFees + courseFees));
    const discount = roundMoney(req.body.discount ?? fee.discount);

    let installments = fee.installments || [];
    let paidAmount = fee.paidAmount;

    if (req.body.installments !== undefined) {
      if (!Array.isArray(req.body.installments)) {
        return res.status(400).json({ message: 'Installments must be an array' });
      }
      installments = req.body.installments.map(inst => ({
        amount: roundMoney(inst.amount),
        paymentMethod: inst.paymentMethod || 'Cash',
        paymentType: inst.paymentType || 'Installment',
        paidDate: inst.paidDate || new Date(),
        receiptNumber: inst.receiptNumber || buildReceiptNumber(),
        note: inst.note || ''
      }));
      paidAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
    } else {
      paidAmount = roundMoney(req.body.paidAmount ?? fee.paidAmount);
    }

    const totalError = validatePaymentTotals({ totalFees, paidAmount, discount });
    if (totalError) return res.status(400).json({ message: totalError });

    if (req.body.studentId) {
      const student = await Student.findByPk(req.body.studentId);
      if (!student) return res.status(400).json({ message: 'Selected student does not exist' });
    }

    if (req.body.courseId) {
      const course = await Course.findByPk(req.body.courseId);
      if (!course) return res.status(400).json({ message: 'Selected course does not exist' });
    }

    await fee.update({
      ...req.body,
      admissionFees,
      courseFees,
      totalFees,
      paidAmount,
      discount,
      installments
    });
    res.json(await getFeeWithDetails(fee.id));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add installment/payment
router.post('/:id/installment', auth, [
  body('amount').isNumeric(),
  body('paymentMethod').notEmpty(),
  body('paymentType').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    // Branch admins can only add installments to fees in their branch
    if (req.admin.role === 'branch_admin' && fee.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage fees in your branch' });
    }

    const amount = roundMoney(req.body.amount);
    if (amount <= 0) return res.status(400).json({ message: 'Payment amount must be greater than zero' });

    const pendingAmount = roundMoney(fee.pendingAmount);
    if (amount > pendingAmount) {
      return res.status(400).json({ message: 'Payment amount cannot be greater than pending fees' });
    }

    const installments = Array.isArray(fee.installments) ? fee.installments : [];
    const newInstallment = {
      amount,
      paymentMethod: req.body.paymentMethod,
      paymentType: req.body.paymentType,
      paidDate: req.body.paidDate || new Date(),
      receiptNumber: req.body.receiptNumber || buildReceiptNumber(),
      note: req.body.note || ''
    };

    await fee.update({
      paidAmount: roundMoney(fee.paidAmount) + amount,
      paymentMethod: req.body.paymentMethod,
      paymentType: req.body.paymentType,
      installments: [...installments, newInstallment],
    });

    res.json(await getFeeWithDetails(fee.id));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete fee record
router.delete('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    // Branch admins can only delete fees in their branch
    if (req.admin.role === 'branch_admin' && fee.branch !== req.admin.branch) {
      return res.status(403).json({ message: 'You can only manage fees in your branch' });
    }

    await fee.destroy();
    res.json({ message: 'Fee record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
