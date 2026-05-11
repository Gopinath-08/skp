const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C', 'Pass'],
    default: 'Pass'
  },
  qrCode: {
    type: String // URL or path to QR code
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  pdfPath: {
    type: String // path to generated PDF
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);