const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const hasCloudinaryCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const studentFacultyStorage = hasCloudinaryCredentials
  ? new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const folderByField = {
        photo: 'profile-photos',
        tenthCertificate: 'student-certificates',
        twelfthCertificate: 'student-certificates'
      };

      return {
        folder: `ideal-computer-education/${folderByField[file.fieldname] || 'uploads'}`,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
      };
    }
  })
  : localStorage;

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'));
  }
};

const studentFacultyFileFilter = (req, file, cb) => {
  const allowedByField = {
    photo: /jpeg|jpg|png/,
    tenthCertificate: /jpeg|jpg|png|pdf/,
    twelfthCertificate: /jpeg|jpg|png|pdf/
  };
  const allowedTypes = allowedByField[file.fieldname];

  if (!allowedTypes) {
    return cb(new Error('Unsupported upload field'));
  }

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(new Error('Profile photo must be JPG/PNG. Certificates must be JPG, PNG, or PDF.'));
};

// Upload middleware
const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Profile picture upload (Cloudinary - optimized for smaller files)
const profileUpload = multer({
  storage: studentFacultyStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for profile photos and certificates
  },
  fileFilter: studentFacultyFileFilter
});

module.exports = {
  upload,
  profileUpload
};
