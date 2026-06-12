const express = require('express');
const { Setting } = require('../models/associations');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();
const VISITOR_COUNT_KEY = 'visitorCount';

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/visitor-count', async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: VISITOR_COUNT_KEY } });
    res.json({ count: Number.parseInt(setting?.value || '0', 10) || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/visitor-count', async (req, res) => {
  try {
    const count = await Setting.sequelize.transaction(async (transaction) => {
      const [setting] = await Setting.findOrCreate({
        where: { key: VISITOR_COUNT_KEY },
        defaults: { value: '0' },
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      const nextCount = (Number.parseInt(setting.value || '0', 10) || 0) + 1;
      setting.value = String(nextCount);
      await setting.save({ transaction });
      return nextCount;
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update or create setting
router.post('/', auth, upload.single('logo'), async (req, res) => {
  try {
    if (req.file) {
      await Setting.upsert({ key: 'logo', value: req.file.path });
    }
    
    for (const [key, value] of Object.entries(req.body)) {
      await Setting.upsert({ key, value });
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
