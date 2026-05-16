const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Batch = sequelize.define('Batch', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schedule: {
    type: DataTypes.STRING, // e.g., MWF, TThS
    allowNull: false
  },
  timing: {
    type: DataTypes.STRING, // e.g., 10:00 AM - 12:00 PM
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  facultyId: {
    type: DataTypes.INTEGER
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Batch;
