const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  grade: {
    type: DataTypes.STRING,
    defaultValue: 'Pass'
  },
  qrCode: {
    type: DataTypes.STRING
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  pdfPath: {
    type: DataTypes.STRING
  }
});

module.exports = Certificate;
