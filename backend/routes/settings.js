const express = require('express');
const { Setting } = require('../models/associations');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json(settings);
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
