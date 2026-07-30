const sequelize = require('./config/database');
const { Admin } = require('./models/associations');
require('dotenv').config();

const addColumnIfMissing = async (table, column, type = 'VARCHAR(255)') => {
  try {
    await sequelize.query(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type};`);
    console.log(`Added column "${column}" to "${table}" table`);
  } catch (e) {
    // Column already exists - ignore
  }
};

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding admin credentials.');
    }

    await sequelize.authenticate();
    console.log('PostgreSQL connected for seeding');

    // Ensure all new columns exist before model queries
    await addColumnIfMissing('Admins', 'branch');
    await addColumnIfMissing('Fees', 'branch');
    await addColumnIfMissing('Certificates', 'branch');
    await addColumnIfMissing('Inquiries', 'branch');
    await addColumnIfMissing('Notices', 'branch');
    await addColumnIfMissing('Galleries', 'branch');

    // Update or create superadmin
    const existingAdmin = await Admin.findOne({ where: { email: process.env.ADMIN_EMAIL } });
    const adminToUpdate = existingAdmin || await Admin.findOne({ order: [['createdAt', 'ASC']] });

    if (adminToUpdate) {
      adminToUpdate.name = process.env.ADMIN_NAME || adminToUpdate.name || 'System Director';
      adminToUpdate.email = process.env.ADMIN_EMAIL;
      adminToUpdate.password = process.env.ADMIN_PASSWORD;
      adminToUpdate.role = 'superadmin';
      adminToUpdate.branch = null;
      await adminToUpdate.save();
      console.log('Superadmin updated successfully:', process.env.ADMIN_EMAIL);
    } else {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'System Director',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'superadmin',
        branch: null
      });
      console.log('Superadmin created successfully:', process.env.ADMIN_EMAIL);
    }

    // Create Sonepur branch admin
    const sonepurEmail = process.env.SONEPUR_ADMIN_EMAIL;
    const sonepurPassword = process.env.SONEPUR_ADMIN_PASSWORD;
    if (sonepurEmail && sonepurPassword) {
      const [branchAdmin, created] = await Admin.findOrCreate({
        where: { email: sonepurEmail.toLowerCase().trim() },
        defaults: {
          name: 'Sonepur Branch Admin',
          email: sonepurEmail.toLowerCase().trim(),
          password: sonepurPassword,
          role: 'branch_admin',
          branch: 'Sonepur'
        }
      });
      if (!created) {
        branchAdmin.name = 'Sonepur Branch Admin';
        branchAdmin.password = sonepurPassword;
        branchAdmin.role = 'branch_admin';
        branchAdmin.branch = 'Sonepur';
        await branchAdmin.save();
      }
      console.log(`${created ? 'Created' : 'Updated'} Sonepur branch admin: ${sonepurEmail}`);
    } else {
      console.log('SONEPUR_ADMIN_EMAIL / SONEPUR_ADMIN_PASSWORD not set, skipping Sonepur admin creation');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
