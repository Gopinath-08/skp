const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  batchTiming: {
    type: DataTypes.STRING
  },
  facultyId: {
    type: DataTypes.INTEGER
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  syllabus: {
    type: DataTypes.JSONB // Stores array of objects
  },
  prerequisites: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Course;