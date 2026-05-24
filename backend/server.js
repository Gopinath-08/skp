const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000 // Increased from 100 to prevent 429 errors during testing
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../frontend/views')));

// Load models & associations
require('./models/associations');

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const feeRoutes = require('./routes/fees');
const certificateRoutes = require('./routes/certificates');
const inquiryRoutes = require('./routes/inquiries');
const facultyRoutes = require('./routes/faculty');
const noticeRoutes = require('./routes/notices');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');
const batchRoutes = require('./routes/batches');
const settingRoutes = require('./routes/settings');
const contentRoutes = require('./routes/content');
const testimonialRoutes = require('./routes/testimonials');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reports', reportRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection
sequelize.authenticate()
.then(() => {
  console.log('PostgreSQL connected');
  return sequelize.sync({ alter: true }); // Automatically updates tables based on models
})
.then(() => console.log('Database synced'))
.catch(err => console.log('Error: ' + err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
