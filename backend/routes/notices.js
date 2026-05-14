const express = require('express');
const { body, validationResult } = require('express-validator');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ 
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } }
      ]
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
    
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notices by type
router.get('/type/:type', async (req, res) => {
  try {
    const notices = await Notice.find({ 
      type: req.params.type,
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } }
      ]
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
    
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice (admin only)
router.post('/', auth, [
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('type').isIn(['General', 'Admission', 'Exam', 'Result', 'Holiday', 'Event']),
  body('priority').isIn(['Low', 'Medium', 'High', 'Urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const noticeData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const notice = new Notice(noticeData);
    await notice.save();

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notice (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name');

    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
