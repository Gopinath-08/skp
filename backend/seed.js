const sequelize = require('./config/database');
const { Admin } = require('./models/associations');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connected for seeding');

    // Sync database (ensure tables exist)
    await sequelize.sync();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    // Note: The Admin model has a beforeSave hook that automatically hashes the password
    const admin = await Admin.create({
      name: 'System Director',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'superadmin'
    });

    console.log('Admin user created successfully');
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();