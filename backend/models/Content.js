const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
  section: {
    type: DataTypes.STRING, // e.g., 'home', 'about', 'contact'
    allowNull: false,
    unique: true
  },
  data: {
    type: DataTypes.JSONB // Stores all content fields for this section
  }
});

module.exports = Content;
