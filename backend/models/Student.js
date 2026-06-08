const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  admissionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Titilagarh'
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parentsName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motherName: {
    type: DataTypes.STRING
  },
  parentNumber: {
    type: DataTypes.STRING
  },
  studentCategory: {
    type: DataTypes.STRING
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  whatsapp: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  aadhaar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING
  },
  district: {
    type: DataTypes.STRING
  },
  pinCode: {
    type: DataTypes.STRING
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  batchId: {
    type: DataTypes.INTEGER
  },
  photo: {
    type: DataTypes.STRING
  },
  tenthCertificate: {
    type: DataTypes.STRING
  },
  twelfthCertificate: {
    type: DataTypes.STRING
  },
  signature: {
    type: DataTypes.STRING
  },
  admissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active'
  }
});

module.exports = Student;
