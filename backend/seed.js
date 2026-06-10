const sequelize = require('./config/database');
const { Admin } = require('./models/associations');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding admin credentials.');
    }

    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connected for seeding');

    // Sync database (ensure tables exist)
    await sequelize.sync();

    // Keep production credentials in sync with the environment.
    // This updates the first existing admin too, so old ADMIN_EMAIL values stop working.
    const existingAdmin = await Admin.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    const adminToUpdate = existingAdmin || await Admin.findOne({ order: [['createdAt', 'ASC']] });

    if (adminToUpdate) {
      adminToUpdate.name = process.env.ADMIN_NAME || adminToUpdate.name || 'System Director';
      adminToUpdate.email = process.env.ADMIN_EMAIL;
      adminToUpdate.password = process.env.ADMIN_PASSWORD;
      adminToUpdate.role = adminToUpdate.role || 'superadmin';
      await adminToUpdate.save();

      console.log('Admin user updated successfully from environment variables');
      console.log(`Email: ${process.env.ADMIN_EMAIL}`);
      process.exit(0);
    }

    // Create admin user
    // Note: The Admin model has a beforeSave hook that automatically hashes the password
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'System Director',
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
