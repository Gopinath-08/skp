# Ideal Computer Education - React Frontend

This is the React-based frontend for the Ideal Computer Education platform, converted from traditional HTML/CSS/JavaScript to a modern, component-based React application.

## Project Structure

```
frontend-react/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Navbar.jsx       # Navigation component
│   │   └── Footer.jsx       # Footer component
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Homepage
│   │   ├── Courses.jsx      # Courses listing
│   │   ├── Gallery.jsx      # Photo gallery
│   │   ├── About.jsx        # About page
│   │   ├── Admission.jsx    # Admission form
│   │   ├── Contact.jsx      # Contact form
│   │   ├── Login.jsx        # Login page
│   │   └── Admin.jsx        # Admin dashboard
│   ├── services/            # API integration
│   │   └── api.js           # Axios API client
│   ├── styles/              # CSS stylesheets
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   └── pages.css
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Key Features

✅ **Component-Based Architecture** - Modular, reusable React components  
✅ **React Router** - Client-side routing for seamless navigation  
✅ **API Integration** - Axios-based service for backend communication  
✅ **Responsive Design** - Mobile-friendly layouts  
✅ **Modern UI/UX** - Professional gradient designs and animations  
✅ **Form Handling** - Contact, admission, and login forms  
✅ **Admin Dashboard** - Manage courses, notices, and students  
✅ **Authentication** - Login and token management  

## Prerequisites

- Node.js v20.15.0+ (v22+ recommended)
- npm 10.9.0+

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd frontend-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   - Copy `.env.development` for development
   - Update `VITE_API_URL` if backend is on a different port

## Development

**Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

**Build the optimized production bundle:**
```bash
npm run build
```

**Preview the production build locally:**
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Ideal Computer Education
```

## API Endpoints

The frontend communicates with these backend API endpoints:

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Students
- `GET /api/students` - List students
- `POST /api/students` - Register new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student info

### Gallery
- `GET /api/gallery` - List gallery images
- `POST /api/gallery` - Upload image (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Notices
- `GET /api/notices` - List all notices
- `POST /api/notices` - Create notice (admin)
- `PUT /api/notices/:id` - Update notice (admin)
- `DELETE /api/notices/:id` - Delete notice (admin)

### Contact/Inquiries
- `POST /api/inquiries` - Submit contact form

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Component Overview

### Pages

- **Home** - Hero section, features, popular courses, stats, CTA
- **Courses** - Course listing with filtering
- **Gallery** - Image gallery with modal preview
- **About** - About us, mission, vision, achievements
- **Admission** - Application form and FAQ
- **Contact** - Contact form and information
- **Login** - User authentication
- **Admin** - Dashboard for course/notice management

### Components

- **Navbar** - Navigation with mobile menu toggle
- **Footer** - Footer with links and social media

## Styling

All styles are organized in the `src/styles/` directory:

- **navbar.css** - Navigation styling
- **footer.css** - Footer styling
- **pages.css** - All page components styling

CSS uses:
- CSS Grid and Flexbox for layouts
- CSS Variables for theming
- Gradients for visual effects
- Animations and transitions

## Authentication Flow

1. User enters credentials on `/login` page
2. Frontend sends request to `/api/auth/login`
3. Backend returns JWT token
4. Token is stored in `localStorage`
5. Token is automatically added to API requests via axios interceptor
6. Admin pages check user role and redirect if unauthorized

## Common Tasks

### Add a New Page

1. Create component in `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route in `<Routes>` component
4. Add navigation link in `Navbar.jsx`
5. Create styles in `src/styles/pages.css`

### Add a New API Service

1. Add service method in `src/services/api.js`
2. Use in components with `async/await`:
   ```jsx
   const data = await courseService.getAll();
   ```

### Deploy to Production

1. Build the app:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains production files

3. Configure CORS on backend to accept requests from your domain

4. Update `VITE_API_URL` in `.env.production` with live API URL

## Troubleshooting

**Issue: API calls fail with CORS error**
- Solution: Ensure backend has CORS enabled and correct origin is allowed

**Issue: Pages don't load after deployment**
- Solution: Check that Vite build output path is correctly configured

**Issue: Images not loading**
- Solution: Verify image URLs are correct or use relative paths

**Issue: Routing not working**
- Solution: Ensure `<BrowserRouter>` wraps the app (already done in App.jsx)

## Development Workflow

1. Run development server: `npm run dev`
2. Make changes to components/pages
3. HMR (Hot Module Replacement) automatically reloads the page
4. Check console for errors
5. Build and test before production: `npm run build`

## Performance Optimization

- Code splitting with React Router
- Lazy loading images
- CSS organization prevents style conflicts
- Axios request/response interceptors
- Environment-based API URLs

## Security Considerations

- JWT tokens stored in localStorage (consider using httpOnly cookies)
- API calls made from frontend (consider backend for sensitive operations)
- CORS headers properly configured
- Input validation on forms

## Next Steps

1. Connect backend API
2. Implement real authentication
3. Add image optimization
4. Set up CI/CD pipeline
5. Deploy to production server
6. Configure HTTPS
7. Add error boundaries
8. Implement error logging

## Support

For issues or questions, contact the development team at info@idealedu.com

## License

© 2026 Ideal Computer Education. All rights reserved.
