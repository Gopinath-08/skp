const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  parentsName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  whatsapp: {
    type: String
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  aadhaar: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  photo: {
    type: String // path to uploaded photo
  },
  signature: {
    type: String // path to uploaded signature
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active'
  },
  fees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee'
  }]
});

module.exports = mongoose.model('Student', studentSchema);