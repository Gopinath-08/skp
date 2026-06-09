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
  
  console.log('📁 Processing file object:', {
    hasSecureUrl: !!file.secure_url,
    hasPath: !!file.path,
    hasFilename: !!file.filename,
    secureUrl: file.secure_url ? '...' : undefined,
    path: file.path ? file.path.substring(0, 100) : undefined,
    filename: file.filename
  });
  
  // Priority 1: Check for Cloudinary secure_url (HTTPS - most reliable)
  if (file.secure_url) {
    console.log('✅ Using Cloudinary secure_url');
    return file.secure_url;
  }
  
  // Priority 2: Check for Cloudinary url (HTTP fallback)
  if (file.url && (file.url.includes('cloudinary') || file.url.includes('res.'))) {
    console.log('✅ Using Cloudinary HTTP url');
    return file.url;
  }
  
  // Priority 3: Check if path is a full Cloudinary URL
  if (file.path && file.path.includes('cloudinary')) {
    console.log('✅ Using Cloudinary path URL');
    return file.path;
  }
  
  // Priority 4: Local storage - construct path from filename
  if (file.filename) {
    const localPath = `/uploads/${file.filename}`;
    console.log('📂 Using local storage path:', localPath);
    return localPath;
  }
  
  // Priority 5: Fallback - use basename from path
  if (file.path && !file.path.includes('cloudinary')) {
    const localPath = `/uploads/${path.basename(file.path)}`;
    console.log('📂 Using local storage path (fallback):', localPath);
    return localPath;
  }
  
  console.warn('⚠️ No valid file path found in file object');
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

  if (req.files?.aadhaarCard?.[0]) {
    updates.aadhaarCard = extractFilePath(req.files.aadhaarCard[0]);
  }

  if (req.files?.certificate1?.[0]) {
    updates.certificate1 = extractFilePath(req.files.certificate1[0]);
  }

  if (req.files?.certificate2?.[0]) {
    updates.certificate2 = extractFilePath(req.files.certificate2[0]);
  }

  if (req.files?.certificate3?.[0]) {
    updates.certificate3 = extractFilePath(req.files.certificate3[0]);
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
