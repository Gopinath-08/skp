const express = require('express');
const { Content } = require('../models/associations');
const auth = require('../middleware/auth');

const router = express.Router();

// Get content by section
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ where: { section: req.params.section } });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.post('/:section', auth, async (req, res) => {
  try {
    const [content, created] = await Content.findOrCreate({
      where: { section: req.params.section },
      defaults: { data: req.body }
    });

    if (!created) {
      await content.update({ data: req.body });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
