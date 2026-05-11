const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true // e.g., "3 months", "6 months"
  },
  fees: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Basic', 'Advanced', 'Certification', 'Skill Development'],
    required: true
  },
  syllabus: [{
    topic: String,
    description: String
  }],
  prerequisites: {
    type: String
  },
  image: {
    type: String // path to course image
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);