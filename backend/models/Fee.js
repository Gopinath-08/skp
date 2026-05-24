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
  paymentType: {
    type: DataTypes.STRING, // e.g., 'Full Payment', 'Installment'
    defaultValue: 'Installment'
  },
  admissionFees: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  courseFees: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  installments: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  hooks: {
    beforeSave: (fee) => {
      const totalFees = Number(fee.totalFees || 0);
      const paidAmount = Number(fee.paidAmount || 0);
      const discount = Number(fee.discount || 0);
      fee.pendingAmount = Math.max(totalFees - paidAmount - discount, 0);
    }
  }
});

module.exports = Fee;
