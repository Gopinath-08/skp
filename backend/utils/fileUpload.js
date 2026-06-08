const path = require('path');

// Utility function to get file path/URL from upload
// Works with both local storage and Cloudinary
const getFilePath = (file) => {
  if (!file) return null;
  return extractFilePath(file);
};

// Extract file path from multer response
const extractFilePath = (file) => {
  if (!file) return null;
  
  // For Cloudinary storage: file.path contains the secure_url
  if (file.path && file.path.includes('cloudinary')) {
    return file.path;
  }
  
  // For local disk storage: expose the URL served by server.js
  if (file.filename) {
    return `/uploads/${file.filename}`;
  }

  if (file.path) {
    return `/uploads/${path.basename(file.path)}`;
  }
  
  return null;
};

// Handle profile picture upload for students
const handleStudentProfileUpload = (req) => {
  const updates = {};
  
  if (req.files?.photo?.[0]) {
    updates.photo = extractFilePath(req.files.photo[0]);
  }
  
  if (req.files?.tenthCertificate?.[0]) {
    updates.tenthCertificate = extractFilePath(req.files.tenthCertificate[0]);
  }

  if (req.files?.twelfthCertificate?.[0]) {
    updates.twelfthCertificate = extractFilePath(req.files.twelfthCertificate[0]);
  }
  
  return updates;
};

// Handle profile picture upload for faculty
const handleFacultyProfileUpload = (req) => {
  if (!req.file) return null;
  return extractFilePath(req.file);
};

module.exports = {
  getFilePath,
  extractFilePath,
  handleStudentProfileUpload,
  handleFacultyProfileUpload
};
