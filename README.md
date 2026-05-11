# Ideal Computer Education - Complete ERP & Website System

A comprehensive, production-ready coaching institute management system built with modern web technologies.

## 🚀 Features

### Public Website
- **Modern Landing Page** with animated hero section
- **Course Showcase** with interactive cards
- **Student Admission Portal** with file uploads
- **Gallery & Notices** with dynamic content
- **Contact Forms** with validation
- **SEO Optimized** with meta tags and structured data
- **Fully Responsive** design for all devices

### Admin ERP Dashboard
- **Student Management** - Add, edit, view students
- **Course Management** - Manage courses and curriculum
- **Fees Management** - Track payments and installments
- **Certificate Generation** - PDF certificates with QR codes
- **Faculty Management** - Staff and teacher profiles
- **Notice Board System** - Dynamic announcements
- **Gallery Management** - Photo and media uploads
- **Inquiry Management** - Handle student inquiries
- **Analytics Dashboard** - Statistics and reports

### Technical Features
- **JWT Authentication** - Secure admin login
- **File Upload System** - Multer for photos and documents
- **PDF Generation** - Certificate and receipt generation
- **Email Integration** - Nodemailer for notifications
- **Real-time Updates** - Dynamic content loading
- **Modern UI/UX** - Glassmorphism and neumorphism design
- **Performance Optimized** - Fast loading and smooth animations

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **GSAP** - Advanced animations
- **AOS** - Scroll animations
- **Swiper.js** - Sliders and carousels
- **Font Awesome** - Icons
- **Lenis** - Smooth scrolling
- **Particles.js** - Background effects
- **Typed.js** - Typing animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Security & Utilities
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection

## 📁 Project Structure

```
ideal-computer-education/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, upload, validation
│   ├── config/          # Database, email config
│   ├── utils/           # Helper functions
│   ├── uploads/         # File storage
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   └── .env.example     # Environment variables
├── frontend/
│   ├── public/
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # JavaScript files
│   │   ├── images/      # Static images
│   │   └── fonts/       # Custom fonts
│   └── views/
│       ├── index.html   # Home page
│       ├── login.html   # Admin login
│       ├── admin.html   # Admin dashboard
│       └── pages/       # Additional pages
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ideal_computer_education
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed initial data**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev  # Development mode
   # or
   npm start    # Production mode
   ```

### Frontend Setup

The frontend is served by the backend, so no separate setup is required. Just ensure the backend is running.

## 🔐 Admin Access

### Default Admin Credentials
- **Email:** admin@ideal.com
- **Password:** admin123

### Changing Admin Password
1. Login to admin dashboard
2. Go to profile settings
3. Update password

## 📊 Database Models

### Core Models
- **Admin** - System administrators
- **Student** - Student information and admissions
- **Course** - Available courses and curriculum
- **Fee** - Fee structure and payment tracking
- **Certificate** - Generated certificates
- **Inquiry** - Student inquiries
- **Faculty** - Teaching staff
- **Notice** - Announcements and news
- **Gallery** - Photo gallery

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `PUT /api/auth/change-password` - Change password

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/verify/:admissionId` - Verify student

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add new course
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Fees
- `GET /api/fees` - Get all fees
- `GET /api/fees/student/:studentId` - Get fees by student
- `POST /api/fees/:id/installment` - Add installment
- `PUT /api/fees/:id/installment/:installmentId/pay` - Mark installment paid

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Generate certificate
- `GET /api/certificates/:id/download` - Download PDF
- `GET /api/certificates/verify/:certificateNumber` - Verify certificate

### Other Endpoints
- `GET /api/inquiries` - Get inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/faculty` - Get faculty
- `GET /api/notices` - Get notices
- `GET /api/gallery` - Get gallery items
- `GET /api/admin/stats` - Get dashboard stats

## 🎨 Design Features

### Color Palette
- **Primary:** Royal Blue (#1e3a8a), Deep Navy Blue
- **Secondary:** White, Light Gray
- **Accent:** Gold (#fbbf24), Cyan Glow (#06b6d4)

### Typography
- **Primary:** Poppins (Headings)
- **Secondary:** Inter (Body text)
- **Accent:** Outfit (Special elements)

### UI Components
- Glassmorphism cards with backdrop blur
- Gradient overlays and backgrounds
- Smooth hover animations and transitions
- Interactive buttons with ripple effects
- Modern shadows and depth
- Responsive grid layouts
- Custom scrollbars and progress bars

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔍 SEO Features

- Meta tags for social sharing
- Open Graph integration
- Structured data markup
- Fast loading optimization
- Mobile-friendly design
- Semantic HTML structure

## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Set up MongoDB cloud instance (MongoDB Atlas)
4. Configure email service
5. Set up SSL certificate
6. Deploy to cloud platform (Heroku, DigitalOcean, AWS)

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ideal_computer_education
JWT_SECRET=your_production_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_production_app_password
PORT=5000
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for cloud MongoDB

2. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Verify Multer configuration
   - Ensure sufficient disk space

3. **Email Not Sending**
   - Verify email credentials
   - Check SMTP settings
   - Ensure app passwords for Gmail

4. **CORS Errors**
   - Update CORS origin in server.js
   - Check frontend URL configuration

## 📈 Performance Optimization

- **Image Optimization** - Compressed images and lazy loading
- **Code Splitting** - Modular JavaScript loading
- **Caching** - Browser caching and CDN
- **Minification** - CSS and JS minification
- **Database Indexing** - Optimized MongoDB queries
- **API Rate Limiting** - Prevent abuse

## 🔒 Security Features

- **JWT Authentication** with expiration
- **Password Hashing** with bcrypt
- **Input Validation** and sanitization
- **Rate Limiting** on API endpoints
- **Helmet** security headers
- **CORS** configuration
- **File Upload Validation** and size limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Email: iceworldtlg.in@gmail.com
- Phone: 9124280311, 9124280322
- Address: NEAR DAV COLLEGE, TITILAGARH, DIST-BALANGIR, ODISHA, PIN-767033

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by premium EdTech platforms
- Designed for educational excellence
- Created for Ideal Computer Education

---

**"Your Success ! Our Mission"** - Ideal Computer Education#   s k p  
 