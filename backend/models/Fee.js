const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fee = sequelize.define('Fee', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalFees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  pendingAmount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  paymentMethod: {
    type: DataTypes.STRING, // e.g., 'Cash', 'UPI', 'Bank Transfer'
    defaultValue: 'Cash'
  },
  installments: {
    type: DataTypes.JSONB // Array of installment objects
  }
}, {
  hooks: {
    beforeSave: (fee) => {
      fee.pendingAmount = fee.totalFees - fee.paidAmount - (fee.discount || 0);
    }
  }
});

module.exports = Fee;