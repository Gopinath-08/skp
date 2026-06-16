const sequelize = require('./config/database');
const { Student } = require('./models/associations');

const branchCodes = {
  Titilagarh: 'TLG',
  Rajkhariar: 'KHR',
  Khariar: 'KHR',
  Titlagarh: 'TLG',
  Balangir: 'TLG',
  'Khariar Road': 'KHR'
};

const normalizeBranch = (branch) => {
  if (branch === 'Balangir' || branch === 'Titlagarh') return 'Titilagarh';
  if (branch === 'Khariar' || branch === 'Khariar Road') return 'Rajkhariar';
  return branch || 'Titilagarh';
};

const getAdmissionYear = (student) => {
  const dateValue = student.admissionDate || student.createdAt || new Date();
  return String(new Date(dateValue).getFullYear()).slice(-2);
};

const buildAdmissionId = (student, serial) => {
  const branch = normalizeBranch(student.branch);
  const branchCode = branchCodes[branch] || branchCodes.Titilagarh;
  return `ICE${getAdmissionYear(student)}${branchCode}${String(serial).padStart(3, '0')}`;
};

const compareStudents = (first, second) => {
  const firstDate = new Date(first.admissionDate || first.createdAt || 0).getTime();
  const secondDate = new Date(second.admissionDate || second.createdAt || 0).getTime();
  if (firstDate !== secondDate) return firstDate - secondDate;

  const firstCreated = new Date(first.createdAt || 0).getTime();
  const secondCreated = new Date(second.createdAt || 0).getTime();
  if (firstCreated !== secondCreated) return firstCreated - secondCreated;

  return Number(first.id) - Number(second.id);
};

const getGroupKey = (student) => `${getAdmissionYear(student)}:${normalizeBranch(student.branch)}`;

const migrateAdmissionIds = async () => {
  const apply = process.argv.includes('--apply');

  try {
    await sequelize.authenticate();

    const students = await Student.findAll({ order: [['createdAt', 'ASC']] });
    const groups = students.reduce((result, student) => {
      const key = getGroupKey(student);
      result[key] = result[key] || [];
      result[key].push(student);
      return result;
    }, {});

    const migrations = Object.values(groups).flatMap((groupStudents) => (
      groupStudents
        .sort(compareStudents)
        .map((student, index) => ({
          student,
          oldAdmissionId: student.admissionId,
          newAdmissionId: buildAdmissionId(student, index + 1),
          normalizedBranch: normalizeBranch(student.branch)
        }))
    )).filter((item) => item.oldAdmissionId !== item.newAdmissionId);

    if (migrations.length === 0) {
      console.log('All admission IDs already use the correct new format.');
      return;
    }

    console.table(migrations.map((item) => ({
      id: item.student.id,
      student: item.student.fullName,
      branch: item.normalizedBranch,
      oldId: item.oldAdmissionId,
      newId: item.newAdmissionId
    })));

    if (!apply) {
      console.log('Dry run only. Run `node migrate-admission-ids.js --apply` to update the database.');
      return;
    }

    await sequelize.transaction(async (transaction) => {
      for (const item of migrations) {
        await item.student.update({
          admissionId: `TMP${Date.now()}${item.student.id}`,
          branch: item.normalizedBranch
        }, { transaction });
      }

      for (const item of migrations) {
        await item.student.update({
          admissionId: item.newAdmissionId,
          branch: item.normalizedBranch
        }, { transaction });
      }
    });

    console.log(`Updated ${migrations.length} admission ID(s) to the new format.`);
  } catch (error) {
    console.error('Admission ID migration failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

migrateAdmissionIds();
