const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
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
  totalFees: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number,
    default: function() {
      return this.totalFees - this.paidAmount;
    }
  },
  installments: [{
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending'
    },
    receiptNumber: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate pending amount before saving
feeSchema.pre('save', function(next) {
  this.pendingAmount = this.totalFees - this.paidAmount;
  next();
});

module.exports = mongoose.model('Fee', feeSchema);