const Student = require('./Student');
const Course = require('./Course');
const Fee = require('./Fee');
const Certificate = require('./Certificate');
const Admin = require('./Admin');
const Gallery = require('./Gallery');
const Notice = require('./Notice');
const Batch = require('./Batch');
const Setting = require('./Setting');
const Content = require('./Content');
const Testimonial = require('./Testimonial');
const Faculty = require('./Faculty');
const Inquiry = require('./Inquiry');

// Associations
Student.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Student, { foreignKey: 'courseId' });

Fee.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Fee, { foreignKey: 'studentId' });

Fee.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Fee, { foreignKey: 'courseId' });

Certificate.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Certificate, { foreignKey: 'studentId' });

Certificate.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Certificate, { foreignKey: 'courseId' });

Gallery.belongsTo(Admin, { foreignKey: 'uploadedBy' });
Admin.hasMany(Gallery, { foreignKey: 'uploadedBy' });

Notice.belongsTo(Admin, { foreignKey: 'createdBy' });
Admin.hasMany(Notice, { foreignKey: 'createdBy' });

Course.belongsTo(Faculty, { foreignKey: 'facultyId' });
Faculty.hasMany(Course, { foreignKey: 'facultyId' });

Batch.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Batch, { foreignKey: 'courseId' });

Batch.belongsTo(Faculty, { foreignKey: 'facultyId' });
Faculty.hasMany(Batch, { foreignKey: 'facultyId' });

Student.belongsTo(Batch, { foreignKey: 'batchId' });
Batch.hasMany(Student, { foreignKey: 'batchId' });

module.exports = {
  Student,
  Course,
  Fee,
  Certificate,
  Admin,
  Gallery,
  Notice,
  Batch,
  Setting,
  Content,
  Testimonial,
  Faculty,
  Inquiry
};
